import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'cancel' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-600 focus-visible:ring-primary shadow-sm',
  secondary:
    'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] focus-visible:ring-slate-400',
  cancel:
    'bg-primary-50 text-primary hover:bg-primary-100 focus-visible:ring-primary',
  outline:
    'border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC] focus-visible:ring-primary',
  ghost: 'text-[#475569] hover:bg-[#F8FAFC] focus-visible:ring-slate-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs gap-1.5 min-w-[80px]',
  md: 'h-10 px-5 text-sm gap-2 min-w-[96px]',
  lg: 'h-11 px-6 text-sm gap-2 min-w-[120px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-[6px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
