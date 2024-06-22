import {
  badRequest,
  conflict,
  generateId,
  generateSaltHash,
  internalServerError
} from '@/helpers';
import { createTRPCRouter, publicProcedure } from '@/server';
import { z } from 'zod';

export const userCreateRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        country: z.string(),
        city: z.string(),
        postalCode: z.string(),
        address: z.string(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8)
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email }
        });

        if (existingUser) return conflict();
        else if (input.password !== input.confirmPassword) return badRequest();

        const { hashedPassword, salt } = await generateSaltHash(input.password);

        if (!hashedPassword || !salt) return internalServerError();

        const user = await ctx.db.user.create({
          data: {
            id: generateId(),
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email
          }
        });

        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'CREATE USER',
            description: `The user ${user.firstName} ${user.lastName} created a new account`
          }
        });

        await ctx.db.userAddress.create({
          data: {
            id: generateId(),
            address: input.address,
            city: input.city,
            country: input.country,
            postalCode: input.postalCode,
            userId: user.id
          }
        });

        await ctx.db.userPassword.create({
          data: {
            id: generateId(),
            salt: salt,
            hashedPassword: hashedPassword,
            userId: user.id
          }
        });

        await ctx.db.userRole.create({
          data: {
            id: generateId(),
            userId: user.id
          }
        });
      } catch (e) {
        await ctx.db.userLog.create({
          data: {
            id: generateId(),
            action: 'FAILED CREATE USER',
            description: 'Someone tried to make a new user'
          }
        });

        internalServerError();
      }
    })
});
