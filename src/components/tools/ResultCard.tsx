"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatFileSize } from "@/lib/utils";
import { ProcessingResult } from "@/types";

interface ResultCardProps {
  result: ProcessingResult;
  onDownload: (index: number) => void;
  onDownloadZip?: () => void;
  onCopyText?: () => void;
  onReset: () => void;
  processing?: boolean;
}

export function ResultCard({
  result,
  onDownload,
  onDownloadZip,
  onCopyText,
  onReset,
  processing = false,
}: ResultCardProps) {
  if (!result.success) {
    return (
      <div className="card p-6 border-error" role="alert">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-text">Processing Failed</h3>
            <p className="mt-1 text-sm text-error">{result.error || "An unknown error occurred."}</p>
            <div className="mt-4">
              <Button variant="secondary" onClick={onReset}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasMultipleFiles = result.files && result.files.length > 1;
  const hasZip = !!result.zipData;
  const hasText = !!result.text;

  return (
    <div className="card p-6" role="status" aria-live="polite">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text">Processing Complete</h3>
        <div className="flex items-center gap-2">
          {result.originalSize && result.compressedSize && (
            <div className="text-sm text-text-muted">
              {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}
              {result.originalSize > 0 && (
                <Badge variant="success" className="ml-2">
                  {Math.round((1 - result.compressedSize / result.originalSize) * 100)}% smaller
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {hasText && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-text">Extracted Text</span>
            <Button variant="ghost" size="sm" onClick={onCopyText} disabled={processing}>
              Copy Text
            </Button>
          </div>
          <div className="bg-bg-tertiary rounded p-4 max-h-64 overflow-auto font-mono text-sm whitespace-pre-wrap text-text-secondary border border-border">
            {result.text}
          </div>
          <Button variant="secondary" onClick={() => onDownload(0)} disabled={processing} className="mt-3">
            Download as TXT
          </Button>
        </div>
      )}

      {result.files && result.files.length > 0 && (
        <div className="space-y-3">
          {result.files.map((file, index) => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-bg-secondary rounded border border-border">
              <div className="flex items-center gap-3 min-w-0">
                <svg className="h-8 w-8 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-text truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-text-muted">{formatFileSize(file.data.length)} · {file.type}</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onDownload(index)}
                disabled={processing}
              >
                Download
              </Button>
            </div>
          ))}

          {hasZip && onDownloadZip && (
            <Button variant="secondary" onClick={onDownloadZip} disabled={processing} className="w-full">
              Download All as ZIP
            </Button>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" onClick={onReset} disabled={processing} className="w-full sm:w-auto">
          Process Another File
        </Button>
      </div>
    </div>
  );
}