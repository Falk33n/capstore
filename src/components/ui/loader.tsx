import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

export const Loader = () => (
  <Loader2 className={cn('size-5 animate-spin text-primary')} />
);
