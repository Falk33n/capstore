'use client';

import { PageSkeleton } from '@/components';
import { api } from '@/trpc';
import type { UserRoleProps } from '@/types';
import { createContext, useEffect, useState, type ReactNode } from 'react';

export const RoleCtx = createContext<{ role: UserRoleProps }>({
  role: undefined
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRoleProps>(undefined);
  const { isLoading, data } = api.userGet.getCurrentUser.useQuery(undefined, {
    retry: false,
    enabled: role === undefined
  });

  useEffect(() => {
    if (isLoading) return;
    else if (!data) setRole(undefined);
    else if (data.role) {
      setRole(
        data.role === 'Developer'
          ? 'Developer'
          : data.role === 'Admin'
            ? 'Admin'
            : 'User'
      );
    }
  }, [isLoading, data]);

  if (isLoading) return <PageSkeleton />;
  else if (!isLoading) {
    return (
      <RoleCtx.Provider value={{ role: role }}>{children}</RoleCtx.Provider>
    );
  } else return null;
}
