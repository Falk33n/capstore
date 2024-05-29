'use client';

import { api } from '~/trpc/react';
import { Loader } from '../_index';

export function AdminHeader() {
  const { data, isLoading } = api.user.getCurrentUser.useQuery(undefined, {
    retry: false,
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
