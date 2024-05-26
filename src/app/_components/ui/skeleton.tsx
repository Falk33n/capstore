import type { HTMLAttributes } from 'react';
import { cn } from '../../_utilities/shadcn.utilities.ts';

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted-foreground/20',
        className,
      )}
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <div className='space-y-3 w-[75%] mx-auto'>
        <Skeleton className='h-[23rem] w-full' />
        <Skeleton className='h-6 w-[90%' />
        <Skeleton className='h-6 w-[80%]' />
      </div>
    </div>
  );
}
