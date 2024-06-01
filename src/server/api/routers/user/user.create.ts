import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { generateId, generateSaltHash, unknownError } from '../_helpers';

export const userCreateRouter = createTRPCRouter({
  // User router to create a user on the database
  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        currentEmail: z.string().email(),
        currentPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.currentEmail },
        });

        if (existingUser)
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });

        if (input.currentPassword !== input.confirmPassword)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Passwords does not match',
          });

        // Generate salt and hash for secure passwords
        const { hashedPassword, salt } = await generateSaltHash(
          input.currentPassword,
        );

        // Create user in the database
        const createdUser = await ctx.db.user.create({
          data: {
            id: generateId(),
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.currentEmail,
          },
        });

        // Create password entry in the Password table
        await ctx.db.password.create({
          data: {
            id: generateId(),
            salt: salt,
            hashedPassword: hashedPassword,
            userId: createdUser.id,
          },
        });

        return { message: 'User created successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),
});
