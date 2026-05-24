import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from './Button';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-text-muted">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-main focus-visible:border-accent-main disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-warning focus-visible:ring-warning focus-visible:border-warning",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-warning">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
