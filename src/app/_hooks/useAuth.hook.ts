import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '../_components/_index';
import type { UseAuthProps } from '../_types/_index';

// Custom hook to handle authentication messages
export const useAuth = ({
  isLoading,
  data,
  errorMsg,
  successMsg,
}: UseAuthProps) => {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!data?.isValid) {
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
  }, [isLoading, data, errorMsg, successMsg, router, toast]);
};
