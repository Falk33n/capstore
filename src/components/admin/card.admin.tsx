'use client';

import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components';
import { getTodayChartData } from '@/helpers';
import type { ChartAllDataProps } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function AdminCard({
  className,
  title,
  desc,
  children,
  singleData
}: {
  className?: string;
  title: string;
  desc: string;
  children: ReactNode;
  singleData?: ChartAllDataProps;
}) {
  const router = useRouter();

  const fetchData = () => {
    const data = getTodayChartData();
    return data;
  };

  singleData = fetchData();

  return (
    <Card
      className={`relative ${className}`}
      onMouseDown={() => router.push('/admin/statistics')}
    >
      <Button
        variant='icon'
        size='icon'
        aria-label='Go to statistics page'
        title='Go to statistics page'
        className='absolute right-2 top-1/2 -translate-y-1/2'
        onClick={() => router.push('/admin/statistics')}
      >
        <ChevronRight className='size-full' />
      </Button>
      <div className='absolute left-4 top-1/2 -translate-y-1/2 rounded-xl bg-primary p-2.5 text-primary-foreground [&>svg]:size-7'>
        {children}
      </div>
      <CardHeader>
        <CardTitle className='ml-14 pr-5'>
          {JSON.stringify(singleData)}
          {title}
        </CardTitle>
        <CardDescription className='ml-14 pr-5 pt-2.5'>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
