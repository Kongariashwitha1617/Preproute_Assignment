import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SelectOption } from './Select';

interface MultiSelectProps {
  label?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
  required?: boolean;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select options',
  emptyMessage = 'No options available',
  error,
  disabled = false,
  isLoading = false,
  required = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
        {label && (
          <label className="figma-label">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'figma-input min-h-11 justify-between text-left',
            error && 'border-red-500',
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1.5">
            {isLoading ? (
              <span className="text-slate-400">Loading options...</span>
            ) : selectedOptions.length === 0 ? (
              <span className="text-slate-400">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => removeOption(option.value, e)}
                    className="rounded hover:bg-primary-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={cn('ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {isLoading ? (
              <p className="px-3 py-2 text-sm text-slate-500">Loading...</p>
            ) : options.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-500">{emptyMessage}</p>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50',
                      isSelected && 'bg-primary-50 text-primary-700',
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
