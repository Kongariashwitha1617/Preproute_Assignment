import { cn } from '@/lib/utils/cn';

export interface TabOption {
  value: string;
  label: string;
}

interface TabGroupProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
}

export function TabGroup({
  options,
  value,
  onChange,
  className,
  fullWidth = false,
}: TabGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-[6px] border border-[#E2E8F0] bg-white p-1',
        fullWidth && 'flex w-full sm:w-auto',
        className,
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-[5px] px-5 py-2 text-sm font-medium transition-all',
              fullWidth && 'flex-1 sm:flex-none',
              isActive
                ? 'bg-primary-50 text-primary shadow-tab-active'
                : 'text-[#64748B] hover:text-[#334155]',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
