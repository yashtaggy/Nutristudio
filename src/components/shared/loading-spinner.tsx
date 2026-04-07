import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, ...props }: React.ComponentProps<typeof LoaderCircle>) => {
  return (
    <LoaderCircle className={cn('animate-spin', className)} {...props} />
  );
};

export default LoadingSpinner;
