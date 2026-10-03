"use client";

import { useState, useCallback } from "react";
import { FileUploader } from "@/components/upload/FileUploader";
import { ProcessingStateComponent } from "@/components/tools/ProcessingState";
import { ResultCard } from "@/components/tools/ResultCard";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/tools/ErrorMessage";

import { getToolConfig } from "@/lib/tools";
import { UploadedFile, ProcessingResult, ProcessingState } from "@/types";

export function MergePDFClient() {
  const config = getToolConfig("merge-pdf");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);

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
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length < 2) {
      setError("At least 2 PDF files are required");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file.file);
      }

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/merge-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to merge PDFs");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      setResult({
        success: true,
        files: [{ name: "merged.pdf", data, type: "application/pdf" }],
      });
      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to merge PDFs";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files]);

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

  const handleDownloadZip = useCallback(async () => {
    if (!result?.files) return;
    // For single file, just download it
    handleDownload(0);
  }, [result, handleDownload]);

  const canProcess = files.length >= 2 && files.every((f) => f.status !== "failed") && (state as ProcessingState) !== "processing";

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

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {state !== "idle" && state !== "completed" && (
        <ProcessingStateComponent
          state={state}
          progress={progress >= 0 ? progress : undefined}
        />
      )}

      {result && <ResultCard result={result} onDownload={handleDownload} onDownloadZip={handleDownloadZip} onReset={handleReset} processing={state === "processing"} />}

      {files.length >= 2 && state === "idle" && (
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleProcess}
            disabled={!canProcess || (state as ProcessingState) === "processing"}
            className="w-full sm:w-auto"
          >
            Merge {files.length} PDFs
          </Button>
        </div>
      )}
    </div>
  );
}