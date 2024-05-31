'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { getTodayChartData } from '../../_helpers/charts.helpers';
import type { ChartAllDataProps } from '../../_types/charts.types';
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

  // Render a card with a button to go to the statistics page
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
        className='absolute top-1/2 -translate-y-1/2 right-2'
        onClick={() => router.push('/admin/statistics')}
      >
        <ChevronRight className='size-full' />
      </Button>
      <div className='absolute top-1/2 -translate-y-1/2 left-4 bg-primary text-primary-foreground p-2.5 rounded-xl [&>svg]:size-7'>
        {children}
      </div>
      <CardHeader>
        <CardTitle className='ml-14 pr-5'>
          {JSON.stringify(singleData)}
          {title}
        </CardTitle>
        <CardDescription className='pt-2.5 ml-14 pr-5'>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
