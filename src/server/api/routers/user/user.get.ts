import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  checkAdminSession,
  checkSession,
  unknownError,
  unknownUser,
} from '../_helpers/_index';

export const userGetRouter = createTRPCRouter({
  // User router to retrieve details about the currently active user
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkSession();

      // Fetching all data concurrently using Promise.all
      const [user, userPassword, userAddress, userRole, userLog] =
        await Promise.all([
          ctx.db.user.findUnique({ where: { id: id } }),
          ctx.db.userPassword.findUnique({ where: { userId: id } }),
          ctx.db.userAddress.findUnique({ where: { userId: id } }),
          ctx.db.userRole.findUnique({ where: { userId: id } }),
          ctx.db.userLog.findUnique({ where: { userId: id } }),
        ]);

      unknownUser(
        !user ?? !userPassword ?? !userAddress ?? !userRole ?? !userLog,
      );

      // Make the api response more readable when returned
      return {
        user: {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          address: userAddress
            ? {
                address: userAddress.address,
                country: userAddress.country,
                city: userAddress.city,
                postalCode: userAddress.postalCode,
              }
            : null,
          password: userPassword
            ? {
                salt: userPassword.salt,
                hashedPassword: userPassword.hashedPassword,
              }
            : null,
          role: userRole
            ? {
                admin: userRole.admin,
                superAdmin: userRole.superAdmin,
              }
            : null,
        },
        userLog: userLog
          ? {
              action: userLog.action,
              createdAt: userLog.createdAt,
            }
          : null,
        message: 'User successfully found',
      };
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
        const { id } = await checkAdminSession({ ctx: ctx });

        // Fetching all data concurrently using Promise.all
        const [user, userPassword, userAddress, userRole, userLog] =
          await Promise.all([
            ctx.db.user.findUnique({ where: { email: input.currentEmail } }),
            ctx.db.userPassword.findUnique({ where: { userId: id } }),
            ctx.db.userAddress.findUnique({ where: { userId: id } }),
            ctx.db.userRole.findUnique({ where: { userId: id } }),
            ctx.db.userLog.findUnique({ where: { userId: id } }),
          ]);

        unknownUser(
          !user ?? !userPassword ?? !userAddress ?? !userRole ?? !userLog,
        );

        // Make the api response more readable when returned
        return {
          user: {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            address: userAddress
              ? {
                  address: userAddress.address,
                  country: userAddress.country,
                  city: userAddress.city,
                  postalCode: userAddress.postalCode,
                }
              : null,
            password: userPassword
              ? {
                  salt: userPassword.salt,
                  hashedPassword: userPassword.hashedPassword,
                }
              : null,
            role: userRole
              ? {
                  admin: userRole.admin,
                  superAdmin: userRole.superAdmin,
                }
              : null,
          },
          userLog: userLog
            ? {
                action: userLog.action,
                createdAt: userLog.createdAt,
              }
            : null,
          message: 'User successfully found',
        };
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
        await checkAdminSession({ ctx: ctx });

        // Fetching all data concurrently using Promise.all
        const [user, userPassword, userAddress, userRole, userLog] =
          await Promise.all([
            ctx.db.user.findUnique({ where: { id: input.id } }),
            ctx.db.userPassword.findUnique({ where: { userId: input.id } }),
            ctx.db.userAddress.findUnique({ where: { userId: input.id } }),
            ctx.db.userRole.findUnique({ where: { userId: input.id } }),
            ctx.db.userLog.findUnique({ where: { userId: input.id } }),
          ]);

        unknownUser(
          !user ?? !userPassword ?? !userAddress ?? !userRole ?? !userLog,
        );

        // Make the api response more readable when returned
        return {
          user: {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            address: userAddress
              ? {
                  address: userAddress.address,
                  country: userAddress.country,
                  city: userAddress.city,
                  postalCode: userAddress.postalCode,
                }
              : null,
            password: userPassword
              ? {
                  salt: userPassword.salt,
                  hashedPassword: userPassword.hashedPassword,
                }
              : null,
            role: userRole
              ? {
                  admin: userRole.admin,
                  superAdmin: userRole.superAdmin,
                }
              : null,
          },
          userLog: userLog
            ? {
                action: userLog.action,
                createdAt: userLog.createdAt,
              }
            : null,
          message: 'User successfully found',
        };
      } catch (e) {
        // Handle known errors or rethrow unknown errors
        unknownError(e);
      }
    }),

  // User router to retrieve all users from the database
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      await checkAdminSession({ ctx: ctx });

      // Fetching all data concurrently using Promise.all
      const [users, userPasswords, userAddresses, userRoles, userLogs] =
        await Promise.all([
          ctx.db.user.findMany(),
          ctx.db.userPassword.findMany(),
          ctx.db.userAddress.findMany(),
          ctx.db.userRole.findMany(),
          ctx.db.userLog.findMany(),
        ]);

      // Mapping data to respective users
      const usersArray = users.map(user => {
        const userPassword = userPasswords.find(
          password => password.userId === user.id,
        );

        const userAddress = userAddresses.find(
          address => address.userId === user.id,
        );

        const userRole = userRoles.find(role => role.userId === user.id);
        const userLog = userLogs.find(log => log.userId === user.id);

        // Make the api response more readable when returned
        return {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: userAddress
              ? {
                  address: userAddress.address,
                  country: userAddress.country,
                  city: userAddress.city,
                  postalCode: userAddress.postalCode,
                }
              : null,
            password: userPassword
              ? {
                  salt: userPassword.salt,
                  hashedPassword: userPassword.hashedPassword,
                }
              : null,
            role: userRole
              ? {
                  admin: userRole.admin,
                  superAdmin: userRole.superAdmin,
                }
              : null,
          },
          userLog: userLog
            ? {
                action: userLog.action,
                createdAt: userLog.createdAt,
              }
            : null,
          message: 'Users successfully found',
        };
      });

      return usersArray;
    } catch (e) {
      // Handle known errors or rethrow unknown errors
      unknownError(e);
    }
  }),
});
