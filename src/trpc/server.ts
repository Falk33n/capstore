import type { NextRequest } from 'next/server';
import { cache } from 'react';
import 'server-only';
import { createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async ({ req }: { req: NextRequest }) => {
  const headers = new Headers();
  headers.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    req,
    resHeaders: headers,
  });
});

export const api = async (req: NextRequest) => {
  const context = await createContext({ req });
  const caller = createCaller(context);
  return caller;
};
