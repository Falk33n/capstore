import { createCaller } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import type { NextRequest } from 'next/server';
import { cache } from 'react';
import 'server-only';

const createContext = cache(async ({ req }: { req: NextRequest }) => {
  const headers = new Headers();
  headers.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    req,
    resHeaders: headers
  });
});

export const api = async (req: NextRequest) => {
  const context = await createContext({ req });
  const caller = createCaller(context);
  return caller;
};
