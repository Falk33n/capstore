import {
  authenticatePassword,
  checkSession,
  generateAuthCookies,
  generateId,
  internalServerError,
  notFound,
  unauthorized
} from '@/helpers';
import { createTRPCRouter, publicProcedure } from '@/server';
import { z } from 'zod';

export const userAuthRouter = createTRPCRouter({
  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8)
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { email: input.email }
        });

        if (!user) return notFound();

        const userPassword = await ctx.db.userPassword.findUnique({
          where: { userId: user.id }
        });

        if (!userPassword) return notFound();

        const validPassword = await authenticatePassword(
          input.password,
          userPassword.hashedPassword,
          userPassword.salt
        );

        if (!validPassword) return unauthorized();

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'LOGIN USER',
            description: `The user ${user.firstName} ${user.lastName} logged in`
          }
        });

        generateAuthCookies(user.id, ctx.req, ctx.resHeaders);
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED LOGIN',
            description: 'Someone tried to login but failed'
          }
        });

        return internalServerError();
      }
    }),

  checkSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const { user } = await checkSession(ctx.db);

      if (!user) return notFound();

      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'CHECK SESSION',
          description: `The user ${user.firstName} ${user.lastName} was authenticated`
        }
      });
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED CHECK SESSION',
          description: 'Someone failed authentication'
        }
      });

      return internalServerError();
    }
  })
});
