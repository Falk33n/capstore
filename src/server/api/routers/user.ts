import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { generateId, generateSaltHash } from './_helpers/user.helpers';

export const userRouter = createTRPCRouter({
  // User router to create a user on the database
  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create user in the database
      const createdUser = await ctx.db.user.create({
        data: {
          id: generateId(),
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
        },
      });

      // Genereate salt and hash for secure passwords and create password entry in the Password table
      const getSaltHash = await generateSaltHash(input.password);
      await ctx.db.password.create({
        data: {
          id: generateId(),
          salt: getSaltHash.salt,
          hash: getSaltHash.hashedPassword,
          userId: createdUser.id,
        },
      });

      return createdUser;
    }),

  // User router to remove a user from the database
  removeUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: {
          email: input.email,
        },
      });
    }),

  // User router to get a user from the database
  getUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
    }),

  // User router to get all users from the database
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  // User router to edit a user on the database
  editUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Generate new hash and update it in the database
      const getHash = (await generateSaltHash(input.password)).hashedPassword;
      return ctx.db.user.update({
        where: {
          email: input.email,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: {
            update: {
              hash: getHash,
            },
          },
        },
      });
    }),
});
