import {
  capitalizeWords,
  checkSession,
  generateId,
  internalServerError,
  notFound
} from '@/helpers';
import { createTRPCRouter, publicProcedure } from '@/server';
import { z } from 'zod';

export const userGetRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    try {
      const { id } = await checkSession(ctx.db);
      const [user, userAddress, userRole] = await Promise.all([
        ctx.db.user.findUnique({ where: { id: id } }),
        ctx.db.userAddress.findUnique({ where: { userId: id } }),
        ctx.db.userRole.findUnique({ where: { userId: id } })
      ]);

      if (!user || !userAddress || !userRole) return notFound();

      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'GET CURRENT USER',
          description: `The user ${user.firstName} ${user.lastName} retrieved their details`
        }
      });

      return {
        id: user.id,
        firstName: capitalizeWords(user.firstName),
        lastName: capitalizeWords(user.lastName),
        email: user.email,
        address: capitalizeWords(userAddress.address),
        country: capitalizeWords(userAddress.country),
        city: capitalizeWords(userAddress.city),
        postalCode: userAddress.postalCode,
        role: userRole.role
      };
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED GET CURRENT USER',
          description: 'Someone tried to retrieve the current user'
        }
      });

      return internalServerError();
    }
  }),

  getUser: publicProcedure
    .input(
      z.object({
        email: z.string().email()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { id, user: admin } = await checkSession(ctx.db);
        const [user, userAddress, userRole] = await Promise.all([
          ctx.db.user.findUnique({ where: { email: input.email } }),
          ctx.db.userAddress.findUnique({ where: { userId: id } }),
          ctx.db.userRole.findUnique({ where: { userId: id } })
        ]);

        if (!admin || !user || !userAddress || !userRole) {
          return notFound();
        }

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'GET USER BY EMAIL',
            description: `The admin ${admin.firstName} ${admin.lastName} retrieved the user ${user.firstName} ${user.lastName} by email`
          }
        });

        return {
          id: user.id,
          firstName: capitalizeWords(user.firstName),
          lastName: capitalizeWords(user.lastName),
          email: user.email,
          address: capitalizeWords(userAddress.address),
          country: capitalizeWords(userAddress.country),
          city: capitalizeWords(userAddress.city),
          postalCode: userAddress.postalCode,
          role: userRole.role
        };
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED GET USER BY EMAIL',
            description: 'Someone tried to retrieve a user by email'
          }
        });

        return internalServerError();
      }
    }),

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      const { user: admin } = await checkSession(ctx.db);
      const [users, userAddresses, userRoles] = await Promise.all([
        ctx.db.user.findMany(),
        ctx.db.userAddress.findMany(),
        ctx.db.userRole.findMany()
      ]);

      if (!admin || !users || !userAddresses || !userRoles) {
        return notFound();
      }

      const usersArray = users.map(user => {
        const userRole = userRoles.find(role => role.userId === user.id);
        const userAddress = userAddresses.find(
          address => address.userId === user.id
        );

        if (!userRole || !userAddress || !user) return notFound();

        return {
          id: user.id,
          firstName: capitalizeWords(user.firstName),
          lastName: capitalizeWords(user.lastName),
          email: user.email,
          address: capitalizeWords(userAddress.address),
          country: capitalizeWords(userAddress.country),
          city: capitalizeWords(userAddress.city),
          postalCode: userAddress.postalCode,
          role: userRole.role
        };
      });

      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'GET ALL USERS',
          description: `The admin ${admin.firstName} ${admin.lastName} retrieved all users`
        }
      });

      return usersArray;
    } catch (e) {
      await ctx.db.userLog.create({
        data: {
          id: generateId(),
          action: 'FAILED GET ALL USERS',
          description: 'Someone tried to retrieve all users'
        }
      });

      return internalServerError();
    }
  })
});
