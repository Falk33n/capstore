import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  generateId,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const userGetRouter = createTRPCRouter({
  // User router to retrieve details about the currently active user
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkSession();

      const [user, userAddress, userRole] = await Promise.all([
        ctx.db.user.findUnique({ where: { id: id } }),
        ctx.db.userAddress.findUnique({ where: { userId: id } }),
        ctx.db.userRole.findUnique({ where: { userId: id } }),
      ]);

      unknownUser(!user ?? !userAddress ?? !userRole);

      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'GET CURRENT',
          description: `The user ${user?.firstName} ${user?.lastName} retrieved their details`,
        },
      });

      // Make the api response more readable when returned
      return {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        address: userAddress?.address,
        country: userAddress?.country,
        city: userAddress?.city,
        postalCode: userAddress?.postalCode,
        admin: userRole?.admin,
        superAdmin: userRole?.superAdmin,
      };
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED GET CURRENT',
          description: `Someone tried to retrieve the current user`,
        },
      });

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
        const { id } = await checkAdminSession({ ctx: ctx });

        // Fetching all data concurrently using Promise.all
        const [user, userAddress, userRole] = await Promise.all([
          ctx.db.user.findUnique({ where: { email: input.currentEmail } }),
          ctx.db.userAddress.findUnique({ where: { userId: id } }),
          ctx.db.userRole.findUnique({ where: { userId: id } }),
        ]);

        const admin = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        unknownUser(!admin ?? !user ?? !userAddress ?? !userRole);

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'GET BY EMAIL',
            description: `The admin ${admin?.firstName} ${admin?.lastName} retrieved the user ${user?.firstName} ${user?.lastName} by email`,
          },
        });

        // Make the api response more readable when returned
        return {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          address: userAddress?.address,
          country: userAddress?.country,
          city: userAddress?.city,
          postalCode: userAddress?.postalCode,
          admin: userRole?.admin,
          superAdmin: userRole?.superAdmin,
        };
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED GET BY EMAIL',
            description: `Someone tried to retrieve a user by email`,
          },
        });

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
        const { id } = await checkAdminSession({ ctx: ctx });

        const [user, userAddress, userRole] = await Promise.all([
          ctx.db.user.findUnique({ where: { id: input.id } }),
          ctx.db.userAddress.findUnique({ where: { userId: input.id } }),
          ctx.db.userRole.findUnique({ where: { userId: input.id } }),
        ]);

        const admin = await ctx.db.user.findUnique({
          where: {
            id: id,
          },
        });

        unknownUser(!admin ?? !user ?? !userAddress ?? !userRole);

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'GET BY ID',
            description: `The admin ${admin?.firstName} ${admin?.lastName} retrieved the user ${user?.firstName} ${user?.lastName} by ID`,
          },
        });

        // Make the api response more readable when returned
        return {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          address: userAddress?.address,
          country: userAddress?.country,
          city: userAddress?.city,
          postalCode: userAddress?.postalCode,
          admin: userRole?.admin,
          superAdmin: userRole?.superAdmin,
        };
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED GET BY ID',
            description: `Someone tried to retrieve a user by ID`,
          },
        });

        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to retrieve all users from the database
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkAdminSession({ ctx: ctx });

      const [users, userAddresses, userRoles] = await Promise.all([
        ctx.db.user.findMany(),
        ctx.db.userAddress.findMany(),
        ctx.db.userRole.findMany(),
      ]);

      const usersArray = users.map(user => {
        const userAddress = userAddresses.find(
          address => address.userId === user.id,
        );
        const userRole = userRoles.find(role => role.userId === user.id);

        // Make the api response more readable when returned
        return {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          address: userAddress?.address,
          country: userAddress?.country,
          city: userAddress?.city,
          postalCode: userAddress?.postalCode,
          admin: userRole?.admin,
          superAdmin: userRole?.superAdmin,
        };
      });

      const user = await ctx.db.user.findUnique({ where: { id: id } });
      unknownUser(!user);

      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'GET ALL',
          description: `The admin ${user?.firstName} ${user?.lastName} retrieved all users`,
        },
      });

      return usersArray;
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED GET ALL',
          description: `Someone tried to retrieve all users`,
        },
      });

      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),
});
