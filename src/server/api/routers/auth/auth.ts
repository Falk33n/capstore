import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  authenticatePassword,
  checkAdminSession,
  checkSession,
  generateAuthCookie,
  unknownError,
  unknownUser,
} from '../_helpers';

export const authRouter = createTRPCRouter({
  // User router to login a user
  loginUser: publicProcedure
    .input(
      z.object({
        currentEmail: z.string().email(),
        currentPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find user by email and include the password relation
        const user = await ctx.db.user.findUnique({
          where: { email: input.currentEmail },
          include: {
            password: true,
          },
        });

        unknownUser(!user);

        if (!user?.password)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Password was not provided',
          });

        // Verify password
        const isPasswordValid = await authenticatePassword(
          input.currentPassword,
          user.password.hashedPassword,
          user.password.salt,
        );

        if (!isPasswordValid)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid password',
          });

        // Create and set auth cookie
        generateAuthCookie(user.id, ctx.resHeaders);

        return { message: 'User logged in successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to check if a user is logged in via the auth cookie
  checkSession: publicProcedure.query(async () => {
    try {
      return {
        isValid: await checkSession(),
        message: 'User is authenticated',
      };
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),

  // User router to check if a user is logged in via the auth cookie and a admin
  checkAdminSession: publicProcedure.query(async ({ ctx }) => {
    try {
      return {
        isValid: await checkAdminSession({ ctx: ctx }),
        message: 'Admin is authenticated',
      };
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),
});
