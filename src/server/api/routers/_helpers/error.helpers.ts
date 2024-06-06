import { TRPCError } from '@trpc/server';

export const unknownError = () => {
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};

export const unknownUser = () => {
  throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
};

export const unauthorizedUser = () => {
  throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
};
