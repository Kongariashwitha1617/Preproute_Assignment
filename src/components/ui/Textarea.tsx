import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
