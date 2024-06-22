'use client';

import { Loader } from '@/components';
import { api } from '@/trpc';

export function AdminHeader() {
  const { data, isLoading } = api.userGet.getCurrentUser.useQuery(undefined, {
    retry: false
  });

  return (
    <h1 className='text-2xl font-bold'>
      {isLoading ? (
        <Loader />
      ) : (
        `Welcome back ${data ? data.firstName : 'to the Admin Dashboard'}!`
      )}
    </h1>
  );
}
