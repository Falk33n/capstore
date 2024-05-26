import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

// Generate a random id
export function generateId(): string {
  return uuidv4();
}

export function unknownError(e: unknown): never {
  if (e instanceof TRPCError) throw e;
  else
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      cause: e,
    });
}
