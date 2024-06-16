'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, type ReactNode } from 'react';
import { RoleCtx } from '../../_contexts/_index';
import { useToast } from '../_index';

export function AdminAuth({ children }: { children: ReactNode }) {
  const { role } = useContext(RoleCtx);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (role === 'developer' || role === 'admin') {
      return;
    } else {
      toast({
        title: 'Error!',
        variant: 'destructive',
        description: 'You are not authorized to access this page',
      });
      router.push('/');
    }
  }, [role, toast, router]);

  if (role === 'developer' || role === 'admin') {
    return (
      <div className='relative flex flex-col items-center bg-card size-full'>
        {children}
      </div>
    );
  } else return null;
}
