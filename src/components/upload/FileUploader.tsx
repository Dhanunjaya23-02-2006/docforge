import { useCallback, useRef, useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { UploadedFile, ToolConfig } from "@/types";
import { formatFileSize } from "@/lib/utils";

interface FileUploaderProps {
  config: ToolConfig;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onRemoveFile: (id: string) => void;
  onReorderFiles: (fromIndex: number, toIndex: number) => void;
  processing?: boolean;
  dragActive?: boolean;
}

const FILE_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/tiff": "TIFF",
  "image/bmp": "BMP",
};

function getFileTypeLabel(type: string): string {
  return FILE_TYPE_LABELS[type] || type.split("/")[1]?.toUpperCase() || "FILE";
}

function validateFile(file: File, config: ToolConfig): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const isValidType = config.acceptedTypes.some((t) => {
    if (file.type === t || file.type.startsWith(t.replace("*", ""))) return true;
    
    // Fallback for Windows/browsers that don't correctly map MIME types
    if (t === "application/pdf" && extension === "pdf") return true;
    if (t.startsWith("image/") && ["jpg", "jpeg", "png", "webp", "gif", "tiff", "bmp"].includes(extension || "")) return true;
    
    return false;
  });

  if (!isValidType) {
    return "File type not supported.";
  }
  if (file.size > config.maxFileSize) {
    return `File is too large. Maximum size is ${formatFileSize(config.maxFileSize)}.`;
  }
  if (file.size === 0) {
    return "File is empty.";
  }
  return null;
}

export function FileUploader({
  config,
  files,
  onFilesChange,
  onRemoveFile,
  onReorderFiles,
  processing = false,
  dragActive = false,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessing = processing || files.some((f) => f.status === "processing" || f.status === "uploading" || f.status === "validating");

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setDragOver(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      if (isProcessing) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [isProcessing]
  );

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  }, [isProcessing]);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      processFiles(selectedFiles);
      e.target.value = "";
    },
    []
  );

  const processFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles: UploadedFile[] = [];
      const errors: string[] = [];

      for (const file of newFiles) {
        const error = validateFile(file, config);
        if (error) {
          errors.push(`${file.name}: ${error}`);
          continue;
        }

        const duplicate = files.find((f) => f.name === file.name && f.size === file.size);
        if (duplicate) {
          errors.push(`${file.name}: Duplicate file.`);
          continue;
        }

        if (config.maxFiles && files.length + validFiles.length >= config.maxFiles) {
          errors.push(`Maximum ${config.maxFiles} files allowed.`);
          break;
        }

        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "idle",
        });
      }

      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
      }
    },
    [config, files, onFilesChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onRemoveFile(id);
    },
    [onRemoveFile]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index > 0) onReorderFiles(index, index - 1);
    },
    [onReorderFiles]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index < files.length - 1) onReorderFiles(index, index + 1);
    },
    [onReorderFiles, files.length]
  );

  const isDragActive = dragActive || dragOver;

  return (
    <div className="w-full">
      <div
        className="sr-only"
        aria-hidden="true"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={config.multipleFiles}
          accept={config.acceptedTypes.join(",")}
          onChange={handleFileSelect}
          disabled={isProcessing}
          aria-label="Upload files"
        />
      </div>

      <div
        className={`relative border-2 rounded-xl transition-colors ${
          isDragActive
            ? "border-accent bg-accent-light"
            : "border-border hover:border-border-strong"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="File upload area"
        aria-describedby="upload-hint"
      >
        <div className="p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-text">
            {isDragActive ? "Drop files here" : "Drag & drop files here, or click to select"}
          </p>
          <p id="upload-hint" className="mt-1 text-sm text-text-muted">
            {config.acceptedTypes.map((t) => t.replace("*", "")).join(", ")} · Max {formatFileSize(config.maxFileSize)}
            {config.multipleFiles ? ` · Up to ${config.maxFiles || "unlimited"} files` : ""}
          </p>
          {isDragActive && (
            <p className="mt-2 text-sm font-medium text-accent" role="status">
              Release to upload
            </p>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2" role="list" aria-label="Uploaded files">
          {files.map((file, index) => (
<UploadItem
              key={file.id}
              file={file}
              index={index}
              total={files.length}
              onRemove={() => handleRemove(file.id)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              getFileTypeLabel={getFileTypeLabel}
/>
          ))}
        </div>
      )}
    </div>
  );
}

interface UploadItemProps {
  file: UploadedFile;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  getFileTypeLabel: (type: string) => string;
}

function UploadItem({
  file,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
  getFileTypeLabel,
}: UploadItemProps) {
  const isProcessing = file.status === "processing" || file.status === "uploading" || file.status === "validating";
  const isCompleted = file.status === "completed";

  const getStatusIcon = () => {
    if (file.status === "failed") {
      return (
        <svg className="h-5 w-5 text-error" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    if (isCompleted) {
      return (
        <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (isProcessing) {
      return <Spinner size="sm" />;
    }
    return (
      <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    );
  };

  const getStatusText = () => {
    switch (file.status) {
      case "uploading":
        return "Uploading...";
      case "validating":
        return "Validating...";
      case "processing":
        return "Processing...";
      case "completed":
        return "Ready";
      case "failed":
        return file.error || "Failed";
      default:
        return "Ready";
    }
  };

  return (
    <div
      className={`card p-3 flex items-center gap-3 ${
        file.status === "failed" ? "border-error" : ""
      }`}
      role="listitem"
    >
      <div className="flex-shrink-0" aria-hidden="true">
        {getStatusIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-text truncate">{file.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-text-muted">{formatFileSize(file.size)}</span>
          <Badge variant="neutral" className="text-xs">{getFileTypeLabel(file.type)}</Badge>
          {file.status === "failed" && (
            <Badge variant="error" className="text-xs">Failed</Badge>
          )}
          {isCompleted && (
            <Badge variant="success" className="text-xs">Ready</Badge>
          )}
          {isProcessing && (
            <Badge variant="primary" className="text-xs">Processing</Badge>
          )}
        </div>
        {file.error && (
          <p className="mt-1 text-xs text-error" role="alert">{file.error}</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {total > 1 && (
          <>
            <button
              onClick={onMoveUp}
              disabled={index === 0 || isProcessing}
              className="btn btn-ghost btn-sm p-1.5"
              aria-label={index === 0 ? "Already at top" : "Move up"}
              aria-disabled={index === 0 || isProcessing}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1 || isProcessing}
              className="btn btn-ghost btn-sm p-1.5"
              aria-label={index === total - 1 ? "Already at bottom" : "Move down"}
              aria-disabled={index === total - 1 || isProcessing}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V5" />
              </svg>
            </button>
          </>
        )}
        <button
          onClick={onRemove}
          disabled={isProcessing}
          className="btn btn-ghost btn-sm p-1.5 text-error hover:text-error hover:bg-error-light"
          aria-label={`Remove ${file.name}`}
          aria-disabled={isProcessing}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}