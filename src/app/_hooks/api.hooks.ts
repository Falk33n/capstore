import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '../_components/_index';
import type { ApiHookProps } from '../_types/_index';

export const useAuth = ({
  isLoading,
  error,
  errorMsg,
  successMsg,
}: ApiHookProps) => {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      router.push('/');
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: errorMsg,
      });
    } else {
      toast({
        variant: 'success',
        title: 'Success!',
        description: successMsg,
      });
    }
  }, [isLoading, error, errorMsg, successMsg, router, toast]);
};
