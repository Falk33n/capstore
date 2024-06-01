import { TRPCError } from "@trpc/server";

// Functions to handle errors

export function unknownError(e: unknown): never {
  if (e instanceof TRPCError) throw e;
  else
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      cause: e,
    });
}

export function unknownUser(boolean: boolean) {
  if (boolean)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    });
}

export function unauthorizedUser(boolean: boolean) {
  if (boolean)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
}