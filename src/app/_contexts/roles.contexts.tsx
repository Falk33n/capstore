'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../../trpc/react';
import { PageSkeleton } from '../_components/_index';
import type { UserRole } from '../_types/_index';

export const RoleCtx = createContext<{ role: UserRole }>({ role: undefined });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(undefined);
  const { isLoading, data } = api.userGet.getCurrentUser.useQuery(undefined, {
    retry: false,
    enabled: role === undefined,
  });

  useEffect(() => {
    if (isLoading) return;
    else if (data) {
      if (data.superAdmin) {
        setRole('superAdmin');
      } else if (data.admin) {
        setRole('admin');
      } else if (!data.admin && !data.superAdmin) {
        setRole('user');
      }
    } else if (!data) {
      setRole(undefined);
    }
  }, [isLoading, data]);

  if (isLoading) return <PageSkeleton />;
  if (!isLoading) {
    return (
      <RoleCtx.Provider value={{ role: role }}>{children}</RoleCtx.Provider>
    );
  } else return null;
}
