"use client";

import { Spinner } from "@/components/ui/Spinner";
import { Progress } from "@/components/ui/Progress";
import { ProcessingState } from "@/types";

interface ProcessingStateProps {
  state: ProcessingState;
  message?: string;
  progress?: number;
  onCancel?: () => void;
  cancellable?: boolean;
}

export function ProcessingStateComponent({
  state,
  message,
  progress,
  onCancel,
  cancellable = false,
}: ProcessingStateProps) {
  const messages: Record<ProcessingState, string> = {
    idle: "Ready to process",
    uploading: "Uploading files...",
    validating: "Validating files...",
    processing: message || "Processing your files...",
    completed: "Processing complete",
    failed: "Processing failed",
    cancelled: "Processing cancelled",
  };

  const getIcon = () => {
    switch (state) {
      case "processing":
      case "uploading":
      case "validating":
        return <Spinner size="lg" />;
      case "completed":
        return (
          <svg className="h-12 w-12 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "failed":
        return (
          <svg className="h-12 w-12 text-error" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case "cancelled":
        return (
          <svg className="h-12 w-12 text-warning" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-12 w-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
    }
  };

  const isActive = ["uploading", "validating", "processing"].includes(state);
  const isComplete = ["completed", "failed", "cancelled"].includes(state);

  return (
    <div className="card p-8 text-center" role="status" aria-live="polite" aria-busy={isActive}>
      <div className="mx-auto mb-4">{getIcon()}</div>
      <h3 className="text-lg font-semibold text-text mb-2">{messages[state]}</h3>
      {message && state === "processing" && <p className="text-sm text-text-muted mb-4">{message}</p>}
      {(state === "processing" || state === "uploading" || state === "validating") && (
        <div className="max-w-md mx-auto">
          <Progress
            value={progress}
            indeterminate={progress === undefined || progress < 0}
            showLabel
            label="Progress"
          />
        </div>
      )}
      {state === "failed" && message && (
        <p className="mt-4 text-sm text-error" role="alert">{message}</p>
      )}
      {cancellable && onCancel && isActive && (
        <button onClick={onCancel} className="mt-4 btn btn-ghost btn-sm">
          Cancel
        </button>
      )}
    </div>
  );
}