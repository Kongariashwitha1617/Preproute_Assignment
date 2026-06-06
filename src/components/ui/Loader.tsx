import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2 className={cn('animate-spin text-primary', sizeStyles[size], className)} />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
