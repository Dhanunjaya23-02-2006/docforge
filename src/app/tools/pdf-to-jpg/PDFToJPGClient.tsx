"use client";

import { useState, useCallback } from "react";
import { FileUploader } from "@/components/upload/FileUploader";
import { ProcessingStateComponent } from "@/components/tools/ProcessingState";
import { ResultCard } from "@/components/tools/ResultCard";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/tools/ErrorMessage";

import { Input } from "@/components/ui/Input";
import { getToolConfig } from "@/lib/tools";
import { UploadedFile, ProcessingResult, ProcessingState } from "@/types";

export function PDFToJPGClient() {
  const config = getToolConfig("pdf-to-jpg");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [pageNumbers, setPageNumbers] = useState("");
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(90);

  const handleFilesChange = useCallback((newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    setError(null);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleReorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
  }, []);

  const handleReset = useCallback(() => {
    setFiles([]);
    setState("idle");
    setResult(null);
    setError(null);
    setProgress(-1);
    setPageNumbers("");
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload a PDF file");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      if (pageNumbers.trim()) formData.append("pageNumbers", pageNumbers);
      formData.append("format", format);
      formData.append("quality", quality.toString());

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/pdf-to-jpg", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to convert PDF to images");
      }

      // This tool currently returns an error explaining the native dependency requirement
      const errorData = await response.json();
      throw new Error(errorData.error || "PDF to image conversion requires Poppler");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to convert PDF to images";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, pageNumbers, format, quality]);

  const canProcess = files.length > 0 && (state as ProcessingState) !== "processing";

  return (
    <div className="space-y-6">
      <FileUploader
        config={config}
        files={files}
        onFilesChange={handleFilesChange}
        onRemoveFile={handleRemoveFile}
        onReorderFiles={handleReorderFiles}
        processing={state === "processing"}
      />

      {files.length > 0 && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-text">Conversion Options</h3>
          
          <Input
            label="Page Numbers (optional)"
            placeholder="e.g., 1,3,5 or 1-3,5-7"
            value={pageNumbers}
            onChange={(e) => setPageNumbers(e.target.value)}
            helperText="Leave empty to convert all pages. Use formats like 1-3, 5, 7-10."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as "jpeg" | "png")}
                className="input"
              >
                <option value="jpeg">JPEG (smaller files)</option>
                <option value="png">PNG (lossless)</option>
              </select>
            </div>
            
            <div>
              <label className="label">Quality</label>
              <Input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                helperText={`${quality}%`}
              />
            </div>
          </div>

          <div className="p-3 bg-bg-secondary rounded border border-border text-sm text-text-muted">
            <strong>Note:</strong> PDF to image conversion requires a PDF rendering engine (Poppler) on the server. 
            This feature is currently not available in this environment. Please use a dedicated PDF to image converter 
            or install Poppler on the server.
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {state !== "idle" && state !== "completed" && (
        <ProcessingStateComponent
          state={state}
          progress={progress >= 0 ? progress : undefined}
        />
      )}

      {files.length > 0 && state === "idle" && (
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleProcess}
            disabled={!canProcess || (state as ProcessingState) === "processing"}
            className="w-full sm:w-auto"
          >
            Convert to JPG
          </Button>
        </div>
      )}
    </div>
  );
}