'use client';

import { useToast } from '@/components';
import { RoleCtx } from '@/contexts';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, type ReactNode } from 'react';

export function AdminAuth({ children }: { children: ReactNode }) {
  const { role } = useContext(RoleCtx);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (role === 'Developer' || role === 'Admin') {
      return;
    } else {
      toast({
        title: 'Error!',
        variant: 'destructive',
        description: 'You are not authorized to access this page'
      });
      router.push('/');
    }
  }, [role, toast, router]);

  if (role === 'User' || role === undefined) return null;
  return (
    <div className='relative flex size-full flex-col items-center bg-card'>
      {children}
    </div>
  );
}
