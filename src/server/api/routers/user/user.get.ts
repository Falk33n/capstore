import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  unknownError,
  unknownUser,
} from '../_helpers';

export const userGetRouter = createTRPCRouter({
  // User router to retrieve details about the currently active user
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkSession();
      const findUser = await ctx.db.user.findUnique({
        where: {
          id: id,
        },
      });

      unknownUser(!findUser);
      return { user: findUser, message: 'User successfully found' };
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),

  // User router to retrieve a user by email from the database
  getUserByEmail: publicProcedure
    .input(
      z.object({
        currentEmail: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        await checkAdminSession({ ctx: ctx });
        const findUser = await ctx.db.user.findUnique({
          where: {
            email: input.currentEmail,
          },
        });

        unknownUser(!findUser);
        return { user: findUser, message: 'User successfully found' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to retrieve a user by id from the database
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        await checkAdminSession({ ctx: ctx });
        const findUser = await ctx.db.user.findUnique({
          where: {
            id: input.id,
          },
        });

        unknownUser(!findUser);
        return { user: findUser, message: 'User successfully found' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to retrieve all users from the database
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      await checkAdminSession({ ctx: ctx });
      return {
        users: await ctx.db.user.findMany(),
        message: 'Users successfully found',
      };
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),
});
