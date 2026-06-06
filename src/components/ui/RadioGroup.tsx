import { cn } from '@/lib/utils/cn';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical' | 'grid';
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  className,
  orientation = 'horizontal',
}: RadioGroupProps) {
  const layoutClass =
    orientation === 'grid'
      ? 'grid grid-cols-2 gap-3 sm:grid-cols-3'
      : orientation === 'vertical'
        ? 'flex flex-col gap-3'
        : 'flex flex-wrap gap-6';

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="figma-label">{label}</p>}
      <div className={layoutClass} role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700"
            >
              <span
                className={cn(
                  'flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors',
                  checked ? 'border-primary' : 'border-slate-300',
                )}
              >
                {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
