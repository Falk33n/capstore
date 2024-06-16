import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  authenticatePassword,
  checkSession,
  generateAuthCookies,
  generateId,
  unauthorizedUser,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const authRouter = createTRPCRouter({
  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (user) {
          const userPassword = await ctx.db.userPassword.findUnique({
            where: { userId: user.id },
          });

          if (userPassword) {
            const validPassword = await authenticatePassword(
              input.password,
              userPassword.hashedPassword,
              userPassword.salt,
            );

            if (!validPassword) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid password',
              });
            }

            await ctx.db.userLog.create({
              data: {
                id: generateId(),
                action: 'LOGIN USER',
                description: `The user ${user.firstName} ${user.lastName} logged in`,
              },
            });

            generateAuthCookies(user.id, ctx.req, ctx.resHeaders);
          }
        }

        if (!user) {
          unknownUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED LOGIN',
            description: 'Someone tried to login to the site',
          },
        });

        unknownError();
      }
    }),

  checkSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const { isValid, id } = await checkSession();

      const user = await ctx.db.user.findUnique({ where: { id: id } });

      const validData = isValid && id && user;

      if (validData) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'CHECK SESSION',
            description: `The user ${user.firstName} ${user.lastName} was authenticated`,
          },
        });

        return true;
      }

      if (!user) {
        unknownUser();
      } else if (!isValid) {
        unauthorizedUser();
      }
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED CHECK SESSION',
          description: 'Someone failed authentication',
        },
      });

      unknownError();
    }
  }),
});
