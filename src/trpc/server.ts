import { headers } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';
import { createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(
  async ({ req, res }: { req: NextRequest; res: NextResponse }) => {
    const heads = new Headers(headers());
    heads.set('x-trpc-source', 'rsc');

    return createTRPCContext(
      {
        headers: heads,
      },
      { req, res },
    );
  },
);

export const api = async (req: NextRequest, res: NextResponse) => {
  const context = await createContext({ req, res });
  return createCaller(context);
};
