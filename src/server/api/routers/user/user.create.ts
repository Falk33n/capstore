import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { generateId, generateSaltHash, unknownError } from '../_helpers/_index';

export const userCreateRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        country: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().min(1),
        address: z.string().min(1),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }
        if (input.password !== input.confirmPassword)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Passwords does not match',
          });

        const { hashedPassword, salt } = await generateSaltHash(input.password);

        const validPassword = hashedPassword && salt;

        if (validPassword) {
          const user = await ctx.db.user.create({
            data: {
              id: generateId(),
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
            },
          });

          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'CREATE USER',
              description: `The user ${user.firstName} ${user.lastName} created a new account`,
            },
          });

          await ctx.db.userAddress.create({
            data: {
              id: generateId(),
              address: input.address,
              city: input.city,
              country: input.country,
              postalCode: input.postalCode,
              userId: user.id,
            },
          });

          await ctx.db.userPassword.create({
            data: {
              id: generateId(),
              salt: salt,
              hashedPassword: hashedPassword,
              userId: user.id,
            },
          });

          await ctx.db.userRole.create({
            data: {
              id: generateId(),
              userId: user.id,
            },
          });
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED CREATE USER',
            description: 'Someone tried to make a new user',
          },
        });

        unknownError();
      }
    }),
});
