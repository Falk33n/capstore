'use client';

import { type ReactNode } from 'react';
import { api } from '~/trpc/react';
import { useAuth } from '../../_hooks/_index';
import { PageSkeleton } from '../_index';

export function AdminSession({ children }: { children: ReactNode }) {
  const { isLoading, isError } = api.auth.checkAdminSession.useQuery(
    undefined,
    {
      retry: false,
    },
  );

  useAuth({
    isLoading: isLoading,
    error: isError,
    errorMsg: 'You are not authorized to view this page',
    successMsg: 'You are a authorized admin',
  });

  if (isLoading) return <PageSkeleton />;
  if (!isLoading && !isError)
    return (
      <div className='flex justify-center items-center bg-card w-full'>
        {children}
      </div>
    );
  return null;
}
