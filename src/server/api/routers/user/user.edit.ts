import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkSession,
  generateId,
  generateSaltHash,
  unauthorizedUser,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const userEditRouter = createTRPCRouter({
  editUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        postalCode: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        email: z.string().email().optional(),
        newEmail: z.string().email().optional(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        newPassword: z.string().min(8).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = await checkSession();

        const {
          firstName,
          lastName,
          address,
          postalCode,
          country,
          city,
          email,
          newEmail,
          password,
          newPassword,
          confirmPassword,
        } = input;
        const updateUser: Prisma.UserUpdateInput = {};
        const updateAddress: Prisma.UserAddressUpdateInput = {};

        const validUserData = Object.keys(updateUser).length > 0;
        const validAddressData = Object.keys(updateAddress).length > 0;
        const validUpdateData = validUserData || validAddressData;
        const validPasswordData =
          (password && confirmPassword && password === confirmPassword) ??
          (password &&
            newPassword &&
            confirmPassword &&
            newPassword === confirmPassword);

        if (firstName) {
          updateUser.firstName = firstName;
        }
        if (lastName) {
          updateUser.lastName = lastName;
        }
        if (email) {
          updateUser.email = email;
        }
        if (newEmail) {
          updateUser.email = newEmail;
        }
        if (address) {
          updateAddress.address = address;
        }
        if (postalCode) {
          updateAddress.postalCode = postalCode;
        }
        if (country) {
          updateAddress.country = country;
        }
        if (city) {
          updateAddress.city = city;
        }

        if (!validUpdateData) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No updates provided',
          });
        } else if (!validPasswordData) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Passwords do not match or password is missing',
          });
        }

        if (validUserData) {
          const updatedUser = await ctx.db.user.update({
            where: { id: id },
            data: updateUser,
          });

          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'EDIT USER',
              description: `The user ${updatedUser.firstName} ${updatedUser.lastName} edited their account`,
            },
          });

          if (!updatedUser) {
            unknownUser();
          }
        }
        if (validAddressData) {
          const updatedAddress = await ctx.db.userAddress.update({
            where: { id: id },
            data: updateAddress,
          });

          if (!updatedAddress) {
            unknownUser();
          }
        }
        if (newPassword) {
          const { hashedPassword, salt } = await generateSaltHash(newPassword);
          const validPassword = hashedPassword && salt;

          if (validPassword) {
            await ctx.db.userPassword.update({
              where: { userId: id },
              data: {
                hashedPassword: hashedPassword,
                salt: salt,
              },
            });
          }
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED EDIT USER',
            description: 'Someone tried to edit a user',
          },
        });

        unknownError();
      }
    }),

  makeAdmin: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        key: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        //const { id } = await checkAdminSession({ ctx: ctx });
        const { id } = await checkSession();

        const user = await ctx.db.user.findUnique({ where: { id: input.id } });
        const admin = await ctx.db.user.findUnique({ where: { id: id } });

        const validData =
          input.key === process.env.SECRET_ADMIN_KEY && id && user && admin;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'MAKE USER ADMIN',
              description: `The user ${user.firstName} ${user.lastName} was made an admin by the admin ${admin.firstName} ${admin.lastName}`,
            },
          });

          await ctx.db.userRole.update({
            where: { userId: user.id },
            data: { admin: true },
          });
        }

        if (!user) {
          unknownUser();
        } else if (!validData) {
          unauthorizedUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED MAKE USER ADMIN',
            description: 'Someone tried to make a user an admin',
          },
        });

        unknownError();
      }
    }),

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
        //const { id } = await checkSuperAdminSession({ ctx: ctx });
        const { id } = await checkSession();

        const user = await ctx.db.user.findUnique({ where: { id: input.id } });
        const superAdmin = await ctx.db.user.findUnique({ where: { id: id } });

        const validData =
          input.adminKey === process.env.SECRET_ADMIN_KEY &&
          input.superAdminKey === process.env.SECRET_SUPER_ADMIN_KEY &&
          id &&
          user &&
          superAdmin;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'MAKE USER SUPER ADMIN',
              description: `The user ${user.firstName} ${user.lastName} was made an super admin by the super admin ${superAdmin.firstName} ${superAdmin.lastName}`,
            },
          });

          await ctx.db.userRole.update({
            where: { userId: user.id },
            data: { superAdmin: true },
          });
        }

        if (!user) {
          unknownUser();
        } else if (!validData) {
          unauthorizedUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED MAKE USER SUPER ADMIN',
            description: 'Someone tried to make a user an super admin',
          },
        });

        unknownError();
      }
    }),
});
