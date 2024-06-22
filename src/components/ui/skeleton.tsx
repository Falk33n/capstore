import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted-foreground/20',
        className
      )}
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div className='space-y-3 mx-auto w-[75%]'>
        <Skeleton className='w-full h-[23rem]' />
        <Skeleton className='w-[90% h-6' />
        <Skeleton className='w-[80%] h-6' />
      </div>
    </div>
  );
}
