import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  checkSuperAdminSession,
  generateId,
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
        const { id } = await checkSession();
        const user = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        unknownUser(!user);
        unauthorizedUser(
          input.firstName !== user?.firstName ??
            input.lastName !== user?.lastName ??
            input.currentEmail !== user?.email ??
            input.currentPassword !== input.confirmPassword ??
            input.safety !== 'I AM SURE',
        );

        await ctx.db.userRole.delete({ where: { userId: user?.id } });
        await ctx.db.userAddress.delete({ where: { userId: user?.id } });
        await ctx.db.userPassword.delete({ where: { userId: user?.id } });
        await ctx.db.user.delete({ where: { id: user?.id } });

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
        const user = await ctx.db.user.findUnique({
          where: {
            email: input.currentEmail,
          },
        });
        const { id } = await checkAdminSession({ ctx: ctx });
        const admin = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        unknownUser(!user || !admin);

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'DELETE USER AS ADMIN',
            description: `The admin ${admin?.firstName} ${admin?.lastName} deleted the user ${user?.firstName} ${user?.lastName}`,
          },
        });

        await ctx.db.userRole.delete({ where: { userId: user?.id } });
        await ctx.db.userAddress.delete({ where: { userId: user?.id } });
        await ctx.db.userPassword.delete({ where: { userId: user?.id } });
        await ctx.db.user.delete({ where: { id: user?.id } });

        return { message: 'User deleted successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to let super admins remove all users
  removeAllUsers: publicProcedure
    .input(
      z.object({
        adminKey: z.string().min(1),
        superAdminKey: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = await checkSuperAdminSession({ ctx: ctx });
        const user = await ctx.db.user.findUnique({ where: { id: id } });

        unknownUser(!user);
        unauthorizedUser(
          input.adminKey !== process.env.SECRET_ADMIN_KEY ||
            input.superAdminKey !== process.env.SECRET_SUPER_ADMIN_KEY,
        );

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'DELETE ALL',
            description: `The super admin ${user?.firstName} ${user?.lastName} deleted all users`,
          },
        });

        await ctx.db.userRole.deleteMany();
        await ctx.db.userAddress.deleteMany();
        await ctx.db.userPassword.deleteMany();
        await ctx.db.user.deleteMany();

        return { message: 'Users successfully deleted' };
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE ALL',
            description: `Someone tried to delete all users`,
          },
        });

        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),
});
