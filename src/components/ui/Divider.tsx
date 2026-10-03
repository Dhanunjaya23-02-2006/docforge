"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", label, className = "", ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          className={`h-full w-px bg-border ${className}`}
          role="separator"
          aria-orientation="vertical"
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div className={`flex items-center gap-4 ${className}`} role="separator" aria-orientation="horizontal">
          <hr className="flex-1 border-border" {...props} />
          <span className="text-sm text-text-muted whitespace-nowrap">{label}</span>
          <hr className="flex-1 border-border" {...props} />
        </div>
      );
    }

    return (
      <hr ref={ref} className={`divider ${className}`} {...props} />
    );
  }
);

Divider.displayName = "Divider";