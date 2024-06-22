import {
  authenticatePassword,
  badRequest,
  checkSession,
  generateId,
  internalServerError,
  notFound,
  unauthorized
} from '@/helpers/';
import { createTRPCRouter, publicProcedure } from '@/server';
import { z } from 'zod';

export const userRemoveRouter = createTRPCRouter({
  removeUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        safetySentence: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, user } = await checkSession(ctx.db);
        const userPassword = await ctx.db.userPassword.findUnique({
          where: { userId: id }
        });

        if (!user || !userPassword) return notFound();
        else if (
          input.email !== user.email &&
          input.password !== input.confirmPassword &&
          input.safetySentence !== 'I AM SURE'
        ) {
          return badRequest();
        }

        const validPassword = await authenticatePassword(
          input.password,
          userPassword.hashedPassword,
          userPassword.salt
        );

        if (!validPassword) return unauthorized();

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'DELETE USER',
            description: `The former user ${user.firstName} ${user.lastName} deleted their account`
          }
        });

        await ctx.db.userRole.delete({ where: { userId: user.id } });
        await ctx.db.userAddress.delete({ where: { userId: user.id } });
        await ctx.db.userPassword.delete({ where: { userId: user.id } });
        await ctx.db.user.delete({ where: { id: user.id } });
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE USER',
            description: 'Someone tried to delete their account'
          }
        });

        return internalServerError();
      }
    }),

  removeUserAsAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { user: admin, role } = await checkSession(ctx.db);
        const user = await ctx.db.user.findUnique({
          where: {
            email: input.email
          }
        });

        if (!user || !admin) return notFound();
        else if (role !== 'Admin' ?? role !== 'Developer') {
          return unauthorized();
        }

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'DELETE USER AS ADMIN',
            description: `The admin ${admin.firstName} ${admin.lastName} deleted the user ${user.firstName} ${user.lastName}`
          }
        });

        await ctx.db.userRole.delete({ where: { userId: user.id } });
        await ctx.db.userAddress.delete({ where: { userId: user.id } });
        await ctx.db.userPassword.delete({ where: { userId: user.id } });
        await ctx.db.user.delete({ where: { id: user.id } });
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE USER AS ADMIN',
            description: 'Someone tried to delete a user'
          }
        });

        return internalServerError();
      }
    }),

  removeAllUsers: publicProcedure
    .input(
      z.object({
        developerKey: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { user, role } = await checkSession(ctx.db);

        if (!user) return notFound();
        else if (role !== 'Developer') return unauthorized();
        else if (!input.developerKey) return badRequest();

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'DELETE ALL USERS',
            description: `The developer ${user.firstName} ${user.lastName} deleted all users`
          }
        });

        await ctx.db.userRole.deleteMany();
        await ctx.db.userAddress.deleteMany();
        await ctx.db.userPassword.deleteMany();
        await ctx.db.user.deleteMany();
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED DELETE ALL',
            description: 'Someone tried to delete all users'
          }
        });

        return internalServerError();
      }
    })
});
