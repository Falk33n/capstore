'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { getTodayChartData } from '../../_helpers/_index';
import type { ChartAllDataProps } from '../../_types/_index';
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
  singleData,
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
        className='top-1/2 right-2 absolute -translate-y-1/2'
        onClick={() => router.push('/admin/statistics')}
      >
        <ChevronRight className='size-full' />
      </Button>
      <div className='top-1/2 left-4 absolute bg-primary p-2.5 rounded-xl text-primary-foreground -translate-y-1/2 [&>svg]:size-7'>
        {children}
      </div>
      <CardHeader>
        <CardTitle className='ml-14 pr-5'>
          {JSON.stringify(singleData)}
          {title}
        </CardTitle>
        <CardDescription className='ml-14 pt-2.5 pr-5'>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
