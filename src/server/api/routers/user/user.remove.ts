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
  removeUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        safetySentence: z.string().min(1),
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

        const validInput =
          input.email === user?.email &&
          input.password === input.confirmPassword &&
          input.safetySentence === 'I AM SURE';
        const validData = id && user && validInput;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'DELETE USER',
              description: `The former user ${user.firstName} ${user.lastName} deleted their account`,
            },
          });

          await ctx.db.userRole.delete({ where: { userId: user.id } });
          await ctx.db.userAddress.delete({ where: { userId: user.id } });
          await ctx.db.userPassword.delete({ where: { userId: user.id } });
          await ctx.db.user.delete({ where: { id: user.id } });
        }

        if (!user) {
          unknownUser();
        } else if (!id) {
          unauthorizedUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE USER',
            description: 'Someone tried to delete their account',
          },
        });

        unknownError();
      }
    }),

  removeUserAsAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = await checkAdminSession({ ctx: ctx });

        const user = await ctx.db.user.findUnique({
          where: {
            email: input.email,
          },
        });
        const admin = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        const validData = user && admin && id;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'DELETE USER AS ADMIN',
              description: `The admin ${admin.firstName} ${admin.lastName} deleted the user ${user.firstName} ${user.lastName}`,
            },
          });

          await ctx.db.userRole.delete({ where: { userId: user.id } });
          await ctx.db.userAddress.delete({ where: { userId: user.id } });
          await ctx.db.userPassword.delete({ where: { userId: user.id } });
          await ctx.db.user.delete({ where: { id: user.id } });

          return;
        }

        if (!id) {
          unauthorizedUser();
        } else if (!validData) {
          unknownUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE USER AS ADMIN',
            description: 'Someone tried to delete a user',
          },
        });

        unknownError();
      }
    }),

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

        const superAdmin = await ctx.db.user.findUnique({ where: { id: id } });

        const validKeys =
          input.adminKey === process.env.SECRET_ADMIN_KEY &&
          input.superAdminKey === process.env.SECRET_SUPER_ADMIN_KEY;
        const validData = id && validKeys && superAdmin;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'DELETE ALL USERS',
              description: `The super admin ${superAdmin.firstName} ${superAdmin.lastName} deleted all users`,
            },
          });

          await ctx.db.userRole.deleteMany();
          await ctx.db.userAddress.deleteMany();
          await ctx.db.userPassword.deleteMany();
          await ctx.db.user.deleteMany();
        }

        if (!superAdmin) {
          unknownUser();
        } else if (!validData) {
          unauthorizedUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE ALL',
            description: 'Someone tried to delete all users',
          },
        });

        unknownError();
      }
    }),
});
