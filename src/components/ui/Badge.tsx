"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "error" | "warning" | "neutral";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "neutral", className = "", ...props }, ref) => {
    const variantClasses = {
      primary: "badge-primary",
      success: "badge-success",
      error: "badge-error",
      warning: "badge-warning",
      neutral: "badge-neutral",
    };

    return (
      <span
        ref={ref}
        className={`badge ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";