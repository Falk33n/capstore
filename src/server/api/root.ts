import {
  createCallerFactory,
  createTRPCRouter,
  userAuthRouter,
  userCreateRouter,
  userEditRouter,
  userGetRouter,
  userRemoveRouter
} from '@/server';

export const appRouter = createTRPCRouter({
  userCreate: userCreateRouter,
  userEdit: userEditRouter,
  userGet: userGetRouter,
  userRemove: userRemoveRouter,
  userAuth: userAuthRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
