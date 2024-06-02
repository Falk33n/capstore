'use client';

import { type ReactNode } from 'react';
import { api } from '~/trpc/react';
import { useAuth } from '../../_hooks/_index';
import { PageSkeleton } from '../_index';

// Seperate component to ensure only this component is a client component
export function AdminSession({ children }: { children: ReactNode }) {
  const { data, isLoading } = api.auth.checkAdminSession.useQuery(undefined, {
    retry: false,
  });

  useAuth({
    isLoading,
    data,
    errorMsg: 'You are not authorized to view this page',
    successMsg: 'You are a authorized admin',
  });

  // Render different elements based on if the user is a authenticated admin or not
  if (isLoading) return <PageSkeleton />;
  if (!isLoading && data?.isValid)
    return (
      <div className='flex justify-center items-center bg-card w-full'>
        {children}
      </div>
    );
  return null;
}
