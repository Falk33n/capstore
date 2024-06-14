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
    if (role === 'superAdmin' || role === 'admin') {
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

  if (role === 'superAdmin' || role === 'admin') {
    return (
      <div className='flex justify-center items-center bg-card w-full h-full'>
        {children}
      </div>
    );
  } else return null;
}
