import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  checkSuperAdminSession,
  unauthorizedUser,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const userRemoveRouter = createTRPCRouter({
  // User router to let users remove their own accounts
  removeUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        currentEmail: z.string().email(),
        currentPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
        safety: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { isValid, id } = await checkSession();
        unauthorizedUser(!id || !isValid);

        const user = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        unknownUser(!user);

        if (
          input.firstName !== user?.firstName ??
          input.lastName !== user?.lastName ??
          input.currentEmail !== user?.email ??
          input.currentPassword !== input.confirmPassword ??
          input.safety !== 'I AM SURE'
        )
          unauthorizedUser(!id);

        const deletedUser = await ctx.db.user.delete({
          where: {
            id: user?.id,
          },
        });

        unknownUser(!deletedUser);

        const deletedPassword = await ctx.db.password.delete({
          where: {
            userId: user?.id,
          },
        });

        unknownUser(!deletedPassword);

        return { message: 'User deleted successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to let admins remove users
  removeUserAsAdmin: publicProcedure
    .input(
      z.object({
        currentEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { isValid, id } = await checkAdminSession({ ctx: ctx });
        unauthorizedUser(!id || !isValid);

        const deletedUser = await ctx.db.user.delete({
          where: {
            email: input.currentEmail,
          },
        });

        unknownUser(!deletedUser);

        return { message: 'User deleted successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to let super admins remove all users
  removeAllUsers: publicProcedure
    .input(z.object({ superAdminKey: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.superAdminKey !== process.env.SECRET_SUPER_ADMIN_KEY)
          unauthorizedUser(true);

        await checkSuperAdminSession({ ctx: ctx });
        await ctx.db.user.deleteMany();
        await ctx.db.password.deleteMany();

        return { message: 'Users and their passwords successfully deleted' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),
});
