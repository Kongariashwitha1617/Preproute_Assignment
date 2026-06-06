import { cn } from '@/lib/utils/cn';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[#E2E8F0]">{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn('transition-colors hover:bg-[#F8FAFC]/80', className)}>{children}</tr>
  );
}

export function TableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'border-b border-[#E2E8F0] bg-white px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#94A3B8]',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn('px-4 py-4 text-sm text-[#475569]', className)}>{children}</td>
  );
}
