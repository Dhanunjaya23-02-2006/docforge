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

export function ExtractPDFPagesClient() {
  const config = getToolConfig("extract-pdf-pages");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [pageRanges, setPageRanges] = useState("");

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
    setPageRanges("");
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload a PDF file");
      return;
    }

    if (!pageRanges.trim()) {
      setError("Please enter page ranges to extract (e.g., 1-3,5,7-10)");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("pageRanges", pageRanges);

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/extract-pdf-pages", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract pages");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      setResult({
        success: true,
        files: [{ name: "extracted.pdf", data, type: "application/pdf" }],
      });
      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract pages";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, pageRanges]);

  const handleDownload = useCallback((index: number) => {
    if (!result?.files) return;
    const file = result.files[index];
    const url = URL.createObjectURL(new Blob([file.data as unknown as ArrayBuffer], { type: file.type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const canProcess = files.length > 0 && pageRanges.trim() && (state as ProcessingState) !== "processing";

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
          <h3 className="font-semibold text-text">Extract Options</h3>
          
          <Input
            label="Page Ranges"
            placeholder="e.g., 1-3,5,7-10"
            value={pageRanges}
            onChange={(e) => setPageRanges(e.target.value)}
            helperText="Use formats like 1-3, 5, 7-10. Separate with commas. Duplicate pages are removed automatically."
          />

          <div className="text-sm text-text-muted p-3 bg-bg-secondary rounded border border-border">
            <strong>Examples:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><code>1-3</code> — Pages 1, 2, 3</li>
              <li><code>1,3,5</code> — Pages 1, 3, 5</li>
              <li><code>2-4,7,9-10</code> — Pages 2, 3, 4, 7, 9, 10</li>
            </ul>
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

      {result && <ResultCard result={result} onDownload={handleDownload} onReset={handleReset} processing={state === "processing"} />}

      {files.length > 0 && state === "idle" && (
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleProcess}
            disabled={!canProcess || (state as ProcessingState) === "processing"}
            className="w-full sm:w-auto"
          >
            Extract Pages
          </Button>
        </div>
      )}
    </div>
  );
}