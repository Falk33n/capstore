import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { generateId } from './_helpers/all.helpers';
import {
  authenticateUser,
  generateAuthCookie,
  generateSaltHash,
} from './_helpers/user.helpers';

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
    }),

  // User router to remove a user from the database
  removeUser: publicProcedure
    .input(
      z.object({
        email: z.string().min(5).email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: {
          email: input.email,
        },
      });
    }),

  // User router to retrieve a user by email from the database
  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().min(5).email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
    }),

  // User router to retrieve a user by id from the database
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  // User router to retrieve all users from the database
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
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
      const { currentEmail, firstName, lastName, email, password } = input;

      // Prepare update data object
      const updateData: Prisma.UserUpdateInput = {};

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;

      // Update user in the database
      const updatedUser = await ctx.db.user.update({
        where: { email: currentEmail },
        data: updateData,
      });

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
      const { email, password } = input;

      // Find user by email and include the password relation
      const user = await ctx.db.user.findUnique({
        where: { email },
        include: {
          password: true,
        },
      });

      if (!user || !user.password) throw new Error('Invalid email or password');

      // Verify password
      const isPasswordValid = await authenticateUser(
        password,
        user.password.hashedPassword,
        user.password.salt,
      );

      if (!isPasswordValid) throw new Error('Invalid email or password');

      // Create auth cookie and set it in the response
      generateAuthCookie(user.id);

      return { message: 'Logged in successfully' };
    }),
});
