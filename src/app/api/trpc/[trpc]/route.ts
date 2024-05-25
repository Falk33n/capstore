import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';
import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest, res: NextResponse) => {
  return createTRPCContext({ headers: req.headers }, { req, res });
};

const handler = async (req: NextRequest, res: NextResponse) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req, res),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });

  // You can manipulate the response here if needed
  // For example, setting a custom header
  // res.headers.set('x-custom-header', 'value');

  // Return the response
  return response;
};

export { handler as GET, handler as POST };
