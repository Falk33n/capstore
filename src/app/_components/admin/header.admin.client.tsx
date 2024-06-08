'use client';

import { api } from '~/trpc/react';
import { Loader } from '../_index';

export function AdminHeader() {
  const { data, isLoading } = api.userGet.getCurrentUser.useQuery(undefined, {
    retry: false,
  });

  return (
    <h1 className='font-bold text-2xl'>
      {isLoading ? (
        <Loader />
      ) : (
        `Welcome back ${data ? data.firstName : 'to the Admin Dashboard'}!`
      )}
    </h1>
  );
}
