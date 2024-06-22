import { TRPCError } from '@trpc/server';

export function internalServerError() {
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
}

export function notFound() {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Could not find the given data in the database'
  });
}

export function unauthorized() {
  throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
}

export function badRequest() {
  throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid inputs' });
}

export function conflict() {
  throw new TRPCError({
    code: 'CONFLICT',
    message: 'The given data is already found in the database'
  });
}
