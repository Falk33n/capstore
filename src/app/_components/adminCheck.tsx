'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { api } from '~/trpc/react';
import { PageSkeleton, useToast } from './';

// Seperate component to ensure only this component is a client component
export function AdminCheck({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = api.user.checkSession.useQuery(undefined, {
    retry: false, // Ensure no retries are attempted
  });

  // Render different elements based on if the user is a authenticated admin or not
  if (isLoading) return <PageSkeleton />;
  if (data?.isValid && !isLoading) return <div>{children}</div>;
  if (!data?.isValid && !isLoading) {
    router.push('/');
    toast({
      variant: 'destructive',
      title: 'Error!',
      description: 'You are not authorized to view this page',
    });
  }
  return null;
}
