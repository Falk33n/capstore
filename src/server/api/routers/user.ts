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
        currentEmail: z.string().email(),
        currentPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.currentEmail },
        });

        if (existingUser)
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });

        if (input.currentPassword !== input.confirmPassword)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Passwords does not match',
          });

        // Generate salt and hash for secure passwords
        const { hashedPassword, salt } = await generateSaltHash(
          input.currentPassword,
        );

        // Create user in the database
        const createdUser = await ctx.db.user.create({
          data: {
            id: generateId(),
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.currentEmail,
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
        currentEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deleteUser = await ctx.db.user.delete({
          where: {
            email: input.currentEmail,
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
        currentEmail: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const findUser = await ctx.db.user.findUnique({
          where: {
            email: input.currentEmail,
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

  editUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        currentEmail: z.string().email(),
        newEmail: z.string().email().optional(),
        currentPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
        newPassword: z.string().min(8).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          currentEmail,
          firstName,
          lastName,
          newEmail,
          currentPassword,
          newPassword,
          confirmPassword,
        } = input;
        const updateData: Prisma.UserUpdateInput = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (newEmail) updateData.email = newEmail;

        // If no update data is provided, throw an error
        if (Object.keys(updateData).length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No updates provided',
          });
        }

        // Check if password update is needed and if the passwords match
        if (
          !currentPassword ||
          newPassword !== confirmPassword ||
          currentPassword !== confirmPassword
        )
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Passwords do not match or current password is missing',
          });

        // Update user in the database if there is data to update
        let updatedUser;
        if (Object.keys(updateData).length > 0) {
          updatedUser = await ctx.db.user.update({
            where: { email: currentEmail },
            data: updateData,
          });

          unknownUser(!updatedUser);
        }

        // If password is provided, update the Password table
        if (newPassword) {
          const { hashedPassword, salt } = await generateSaltHash(newPassword);

          await ctx.db.password.update({
            where: { userId: updatedUser?.id },
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
