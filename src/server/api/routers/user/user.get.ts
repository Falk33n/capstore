import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  generateId,
  unauthorizedUser,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const userGetRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkSession();

      const [user, userAddress, userRole] = await Promise.all([
        ctx.db.user.findUnique({ where: { id: id } }),
        ctx.db.userAddress.findUnique({ where: { userId: id } }),
        ctx.db.userRole.findUnique({ where: { userId: id } }),
      ]);

      const validData = id && user && userAddress && userRole;

      if (validData) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'GET CURRENT USER',
            description: `The user ${user.firstName} ${user.lastName} retrieved their details`,
          },
        });

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: userAddress.address,
          country: userAddress.country,
          city: userAddress.city,
          postalCode: userAddress.postalCode,
          admin: userRole.admin,
          superAdmin: userRole.superAdmin,
        };
      }

      if (!validData) {
        unknownUser();
      }
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED GET CURRENT USER',
          description: 'Someone tried to retrieve the current user',
        },
      });

      unknownError();
    }
  }),

  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { id } = await checkAdminSession({ ctx: ctx });

        const [user, userAddress, userRole] = await Promise.all([
          ctx.db.user.findUnique({ where: { email: input.email } }),
          ctx.db.userAddress.findUnique({ where: { userId: id } }),
          ctx.db.userRole.findUnique({ where: { userId: id } }),
        ]);
        const admin = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        const validData = id && admin && user && userAddress && userRole;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'GET USER BY EMAIL',
              description: `The admin ${admin.firstName} ${admin.lastName} retrieved the user ${user.firstName} ${user.lastName} by email`,
            },
          });

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: userAddress.address,
            country: userAddress.country,
            city: userAddress.city,
            postalCode: userAddress.postalCode,
            admin: userRole.admin,
            superAdmin: userRole.superAdmin,
          };
        }

        if (!validData) {
          unknownUser();
        } else if (!id) {
          unauthorizedUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED GET USER BY EMAIL',
            description: 'Someone tried to retrieve a user by email',
          },
        });

        unknownError();
      }
    }),

  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { id } = await checkAdminSession({ ctx: ctx });

        const admin = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });
        const [user, userAddress, userRole] = await Promise.all([
          ctx.db.user.findUnique({ where: { id: input.id } }),
          ctx.db.userAddress.findUnique({ where: { userId: input.id } }),
          ctx.db.userRole.findUnique({ where: { userId: input.id } }),
        ]);

        const validData = id && admin && user && userAddress && userRole;

        if (validData) {
          await ctx.db.userLog.create({
            data: {
              id: generateId(),
              action: 'GET USER BY ID',
              description: `The admin ${admin.firstName} ${admin.lastName} retrieved the user ${user.firstName} ${user.lastName} by ID`,
            },
          });

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: userAddress.address,
            country: userAddress.country,
            city: userAddress.city,
            postalCode: userAddress.postalCode,
            admin: userRole.admin,
            superAdmin: userRole.superAdmin,
          };
        }

        if (!id) {
          unauthorizedUser();
        } else if (!validData) {
          unknownUser();
        }
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED GET USER BY ID',
            description: 'Someone tried to retrieve a user by ID',
          },
        });

        unknownError();
      }
    }),

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkAdminSession({ ctx: ctx });

      const admin = await ctx.db.user.findUnique({ where: { id: id } });
      const [users, userAddresses, userRoles] = await Promise.all([
        ctx.db.user.findMany(),
        ctx.db.userAddress.findMany(),
        ctx.db.userRole.findMany(),
      ]);

      const validData = id && users && userAddresses && userRoles && admin;

      if (validData) {
        const usersArray = users.map(user => {
          const userRole = userRoles.find(role => role.userId === user.id);
          const userAddress = userAddresses.find(
            address => address.userId === user.id,
          );

          const validUser = user && userAddress && userRole;

          if (validUser) {
            return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address: userAddress.address,
              country: userAddress.country,
              city: userAddress.city,
              postalCode: userAddress.postalCode,
              admin: userRole.admin,
              superAdmin: userRole.superAdmin,
            };
          } else {
            unknownError();
          }
        });

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'GET ALL USERS',
            description: `The admin ${admin.firstName} ${admin.lastName} retrieved all users`,
          },
        });

        return usersArray;
      }

      if (!admin) {
        unknownUser();
      }
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED GET ALL USERS',
          description: 'Someone tried to retrieve all users',
        },
      });

      unknownError();
    }
  }),
});
