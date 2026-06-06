import { cn } from '@/lib/utils/cn';
import type { TestStatus } from '@/lib/constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: TestStatus | string | null | undefined }) {
  if (!status) {
    return <Badge variant="default">Unknown</Badge>;
  }

  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    draft: { label: 'Draft', variant: 'warning' },
    live: { label: 'Live', variant: 'success' },
    scheduled: { label: 'Scheduled', variant: 'info' },
    unpublished: { label: 'Unpublished', variant: 'danger' },
  };

  const entry = config[status] ?? {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    variant: 'default' as const,
  };

  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
