'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../_index';

export function AdminCard({
  className,
  title,
  desc,
  children,
}: {
  className?: string;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  const router = useRouter();

  // Render a card with a button to go to the statistics page
  return (
    <Card
      className={`relative ${className}`}
      onClick={() => router.push('/admin/statistics')}
    >
      <Button
        variant='icon'
        size='icon'
        aria-label='Go to statistics page'
        title='Go to statistics page'
        className='absolute top-1/2 -translate-y-1/2 right-2'
      >
        <ChevronRight className='size-full' />
      </Button>
      <div className='absolute top-1/2 -translate-y-1/2 left-4 bg-primary text-primary-foreground p-2.5 rounded-xl [&>svg]:size-7'>
        {children}
      </div>
      <CardHeader>
        <CardTitle className='ml-14 pr-5'>{title}</CardTitle>
        <CardDescription className='pt-2.5 ml-14 pr-5'>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
