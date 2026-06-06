import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted && 'border-primary-600 bg-primary-600 text-white',
                    isCurrent && 'border-primary-600 bg-white text-primary-600',
                    !isCompleted && !isCurrent && 'border-slate-300 bg-white text-slate-400',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    'mt-2 hidden text-xs font-medium sm:block',
                    isCurrent ? 'text-primary-600' : 'text-slate-500',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1',
                    isCompleted ? 'bg-primary-600' : 'bg-slate-200',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
