import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary">
        {icon ?? <FileQuestion className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
