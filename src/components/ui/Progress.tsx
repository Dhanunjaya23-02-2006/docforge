"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, indeterminate = false, showLabel = false, label, className = "", ...props }, ref) => {
    const percentage = indeterminate ? null : Math.min(Math.max((value / max) * 100, 0), 100);
    const ariaValueNow = indeterminate ? undefined : percentage;

    return (
      <div ref={ref} className={className} {...props} role="progressbar" aria-valuenow={ariaValueNow as number | undefined} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="relative h-2 bg-bg-tertiary rounded-full overflow-hidden">
          {indeterminate ? (
            <div
              className="absolute inset-0 bg-accent animate-[indeterminate_1.5s_infinite_ease-in-out]"
              style={{ transform: "translateX(-100%)" }}
            />
          ) : (
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        {(showLabel || label) && (
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>{label || ""}</span>
            <span>{indeterminate ? "Processing..." : `${Math.round(percentage ?? 0)}%`}</span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";