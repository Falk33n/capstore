import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  generateSaltHash,
  unauthorizedUser,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const userEditRouter = createTRPCRouter({
  // Router to edit a user
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
        await checkSession();

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

          await ctx.db.userPassword.update({
            where: { userId: updatedUser?.id },
            data: {
              hashedPassword: hashedPassword,
              salt: salt,
            },
          });
        }

        return { message: 'User updated successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // Router to make a user a admin
  makeAdmin: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        key: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const correctKey = input.key === process.env.SECRET_ADMIN_KEY;
        unauthorizedUser(!correctKey);

        await checkAdminSession({ ctx: ctx });
        const user = await ctx.db.user.findUnique({ where: { id: input.id } });
        unknownUser(!user);

        // Update user to a admin
        const adminUser = await ctx.db.userRole.update({
          where: { userId: input.id },
          data: { admin: true },
        });

        unknownUser(!adminUser);
        return { message: 'User updated successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // Router to make a admin a super admin
  makeSuperAdmin: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        adminKey: z.string().min(1),
        superAdminKey: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        unauthorizedUser(
          input.adminKey !== process.env.SECRET_ADMIN_KEY ||
            input.superAdminKey !== process.env.SECRET_SUPER_ADMIN_KEY,
        );

        await checkAdminSession({ ctx: ctx });
        const user = await ctx.db.user.findUnique({ where: { id: input.id } });
        unknownUser(!user);

        // Update user to a super admin
        const superAdminUser = await ctx.db.userRole.update({
          where: { userId: input.id },
          data: { superAdmin: true },
        });

        unknownUser(!superAdminUser);
        return { message: 'User updated successfully' };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),
});
