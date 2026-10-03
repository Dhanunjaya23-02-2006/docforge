"use client";

import { Button } from "@/components/ui/Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
}

export function ErrorMessage({ message, onRetry, onDismiss, retryLabel = "Try Again" }: ErrorMessageProps) {
  return (
    <div className="card p-6 border-error" role="alert">
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-text">Error</h3>
          <p className="mt-1 text-sm text-error">{message}</p>
          <div className="mt-4 flex gap-2">
            {onRetry && (
              <Button variant="primary" size="sm" onClick={onRetry}>
                {retryLabel}
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}