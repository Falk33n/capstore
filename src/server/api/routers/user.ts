import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  authenticatePassword,
  findValidAuthCookie,
  generateAuthCookie,
  generateId,
  generateSaltHash,
  unauthorizedUser,
  unknownError,
  unknownUser,
} from './_helpers/';

export const userRouter = createTRPCRouter({
  // User router to create a user on the database
  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().min(5).email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }

        // Generate salt and hash for secure passwords
        const { hashedPassword, salt } = await generateSaltHash(input.password);

        // Create user in the database
        const createdUser = await ctx.db.user.create({
          data: {
            id: generateId(),
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
          },
        });

        // Create password entry in the Password table
        await ctx.db.password.create({
          data: {
            id: generateId(),
            salt: salt,
            hashedPassword: hashedPassword,
            userId: createdUser.id,
          },
        });

        return createdUser;
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to remove a user from the database
  removeUser: publicProcedure
    .input(
      z.object({
        email: z.string().min(5).email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deleteUser = await ctx.db.user.delete({
          where: {
            email: input.email,
          },
        });

        unknownUser(!deleteUser);

        return deleteUser;
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to retrieve details about the currently active user
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    try {
      const { isValid, id } = findValidAuthCookie();

      unauthorizedUser(!isValid || !id);

      const findUser = await ctx.db.user.findUnique({
        where: {
          id: id,
        },
      });

      unknownUser(!findUser);

      return findUser;
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),

  // User router to retrieve a user by email from the database
  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().min(5).email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const findUser = await ctx.db.user.findUnique({
          where: {
            email: input.email,
          },
        });

        unknownUser(!findUser);

        return findUser;
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
        const findUser = await ctx.db.user.findUnique({
          where: {
            id: input.id,
          },
        });

        unknownUser(!findUser);

        return findUser;
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to retrieve all users from the database
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.user.findMany();
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),

  // User router to edit a user on the database
  editUser: publicProcedure
    .input(
      z.object({
        currentEmail: z.string().email(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { currentEmail, firstName, lastName, email, password } = input;
        const updateData: Prisma.UserUpdateInput = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;

        // Update user in the database
        const updatedUser = await ctx.db.user.update({
          where: { email: currentEmail },
          data: updateData,
        });

        unknownUser(!updatedUser);

        // If password is provided, update the Password table
        if (password) {
          const { hashedPassword, salt } = await generateSaltHash(password);

          await ctx.db.password.update({
            where: { userId: updatedUser.id },
            data: {
              hashedPassword: hashedPassword,
              salt: salt,
            },
          });
        }

        return updatedUser;
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to make a user an admin
  makeAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { isValid, id } = findValidAuthCookie();

        unauthorizedUser(!isValid || !id);

        /*         const user = await ctx.db.user.findUnique({ where: { id: id } });

        unauthorizedUser(user ? !user.admin : false); */

        const updatedAdmin = await ctx.db.user.update({
          where: { email: input.email },
          data: { admin: true },
        });

        unknownUser(!updatedAdmin);

        return updatedAdmin;
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to login a user
  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { email, password } = input;

        // Find user by email and include the password relation
        const user = await ctx.db.user.findUnique({
          where: { email },
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
          password,
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

        return { message: 'Login successful' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to check if a user is logged in via the auth cookie
  checkSession: publicProcedure.query(() => {
    try {
      const { isValid, id } = findValidAuthCookie();

      unauthorizedUser(!isValid || !id);

      return { isValid, id };
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),

  // User router to check if a user is logged in via the auth cookie and a admin
  checkAdminSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const { isValid, id } = findValidAuthCookie();

      unauthorizedUser(!isValid || !id);

      const user = await ctx.db.user.findUnique({ where: { id: id } });

      unauthorizedUser(user ? !user.admin : false);

      return { isValid, id };
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),
});
