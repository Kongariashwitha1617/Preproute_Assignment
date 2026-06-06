import { cn } from '@/lib/utils/cn';

interface PrepRouteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const textSizes = {
  sm: 'text-[22px]',
  md: 'text-[26px]',
  lg: 'text-[32px]',
};

export function PrepRouteLogo({ className, size = 'md' }: PrepRouteLogoProps) {
  return (
    <div
      className={cn('inline-flex select-none items-center font-bold tracking-tight', textSizes[size], className)}
      aria-label="PrepRoute"
    >
      <span className="relative inline-flex items-baseline">
        <span className="relative z-10 text-primary">P</span>
        <svg
          className="pointer-events-none absolute -left-2 -top-3 h-10 w-10"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden
        >
          <path
            d="M30 10C22 4 12 6 8 16"
            stroke="#334155"
            strokeWidth="1.25"
            strokeDasharray="2.5 3.5"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
        <span className="text-[#8BB4F8]">rep</span>
        <span className="text-primary">Route</span>
      </span>
    </div>
  );
}
