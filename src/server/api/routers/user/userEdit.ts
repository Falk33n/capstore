import {
  badRequest,
  checkSession,
  generateId,
  generateSaltHash,
  internalServerError,
  notFound
} from '@/helpers';
import { createTRPCRouter, publicProcedure } from '@/server';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';

export const userEditRouter = createTRPCRouter({
  editUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        address: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        email: z.string().email().optional(),
        newEmail: z.string().email().optional(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        newPassword: z.string().min(8).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, user } = await checkSession(ctx.db);

        if (!user) return notFound();

        const updateUser: Prisma.UserUpdateInput = {};
        const updateAddress: Prisma.UserAddressUpdateInput = {};
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
          confirmPassword
        } = input;

        if (firstName) updateUser.firstName = firstName;
        if (lastName) updateUser.lastName = lastName;
        if (email) updateUser.email = email;
        if (newEmail) updateUser.email = newEmail;
        if (address) updateAddress.address = address;
        if (postalCode) updateAddress.postalCode = postalCode;
        if (country) updateAddress.country = country;
        if (city) updateAddress.city = city;

        if (
          (Object.keys(updateUser).length <= 0 &&
            Object.keys(updateAddress).length <= 0) ||
          (password && confirmPassword && password === confirmPassword) ||
          (password &&
            newPassword &&
            confirmPassword &&
            newPassword === confirmPassword)
        ) {
          return badRequest();
        }

        let updatedTables = '';

        const updateMsg = `The user ${user.firstName} ${user.lastName} edited their details on the ${updatedTables} tables`;

        if (Object.keys(updateUser).length > 0) {
          await ctx.db.user.update({
            where: { id: id },
            data: updateUser
          });

          updatedTables += 'User ';
        }
        if (Object.keys(updateAddress).length > 0) {
          await ctx.db.userAddress.update({
            where: { id: id },
            data: updateAddress
          });

          updatedTables += 'Address ';
        }
        if (newPassword) {
          const { hashedPassword, salt } = await generateSaltHash(newPassword);

          if (hashedPassword && salt) {
            await ctx.db.userPassword.update({
              where: { userId: id },
              data: {
                hashedPassword: hashedPassword,
                salt: salt
              }
            });

            updatedTables += 'Password ';
          }
        }

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'EDIT USER',
            description: updateMsg
          }
        });
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED EDIT USER',
            description: 'Someone tried to edit a user'
          }
        });

        return internalServerError();
      }
    }),
  editUserAsAdmin: publicProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        address: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        email: z.string().email().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, user: admin } = await checkSession(ctx.db);
        const user = await ctx.db.user.findUnique({
          where: { email: input.id }
        });

        if (!user || !admin) return notFound();

        const updateUser: Prisma.UserUpdateInput = {};
        const updateAddress: Prisma.UserAddressUpdateInput = {};
        const {
          firstName,
          lastName,
          address,
          postalCode,
          country,
          city,
          email
        } = input;

        if (firstName) updateUser.firstName = firstName;
        if (lastName) updateUser.lastName = lastName;
        if (email) updateUser.email = email;
        if (address) updateAddress.address = address;
        if (postalCode) updateAddress.postalCode = postalCode;
        if (country) updateAddress.country = country;
        if (city) updateAddress.city = city;

        if (
          Object.keys(updateUser).length <= 0 &&
          Object.keys(updateAddress).length <= 0
        ) {
          return badRequest();
        }

        let updatedTables = '';

        const updateMsg = `The admin ${admin.firstName} ${admin.lastName} edited the user ${user.firstName} ${user.lastName}'s details on the ${updatedTables} tables`;

        if (Object.keys(updateUser).length > 0) {
          await ctx.db.user.update({
            where: { id: id },
            data: updateUser
          });

          updatedTables += 'User ';
        }
        if (Object.keys(updateAddress).length > 0) {
          await ctx.db.userAddress.update({
            where: { id: id },
            data: updateAddress
          });

          updatedTables += 'Address ';
        }

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'EDIT USER AS ADMIN',
            description: updateMsg
          }
        });
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED EDIT USER',
            description: 'Someone tried to edit a user'
          }
        });

        return internalServerError();
      }
    }),

  editRole: publicProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(['Developer', 'Admin', 'User']),
        developerKey: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { user: developer } = await checkSession(ctx.db);
        const user = await ctx.db.user.findUnique({ where: { id: input.id } });

        if (!user || !developer) return notFound();
        else if (
          input.developerKey === process.env.SECRET_DEVELOPER_KEY &&
          input.role
        ) {
          return badRequest();
        }

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: `EDIT ROLE TO ${input.role}`,
            description: `The user ${user.firstName} ${user.lastName} was made an ${input.role} by the developer ${developer.firstName} ${developer.lastName}`
          }
        });

        await ctx.db.userRole.update({
          where: { userId: user.id },
          data: { role: input.role }
        });
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED EDIT ROLE',
            description: 'Someone tried to make a user an admin'
          }
        });

        return internalServerError();
      }
    })
});
