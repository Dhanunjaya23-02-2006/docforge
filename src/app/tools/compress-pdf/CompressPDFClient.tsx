"use client";

import { useState, useCallback } from "react";
import { FileUploader } from "@/components/upload/FileUploader";
import { ProcessingStateComponent } from "@/components/tools/ProcessingState";
import { ResultCard } from "@/components/tools/ResultCard";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/tools/ErrorMessage";

import { getToolConfig } from "@/lib/tools";
import { UploadedFile, ProcessingResult, ProcessingState } from "@/types";

type CompressionLevel = "basic" | "balanced" | "strong";

export function CompressPDFClient() {
  const config = getToolConfig("compress-pdf");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [level, setLevel] = useState<CompressionLevel>("balanced");
  const [preserved, setPreserved] = useState(false);

  const handleFilesChange = useCallback((newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    setError(null);
    setPreserved(false);
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
    setLevel("balanced");
    setPreserved(false);
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload a PDF file");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);
    setPreserved(false);

    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("level", level);

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compress PDF");
      }

      const preservedHeader = response.headers.get("X-Preserved");
      if (preservedHeader === "true") {
        setPreserved(true);
        setResult({
          success: true,
          files: [{ name: files[0].name, data: new Uint8Array(await files[0].file.arrayBuffer()), type: "application/pdf" }],
        });
        setState("completed");
        setProgress(100);
        return;
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      const originalSize = parseInt(response.headers.get("X-Original-Size") || "0", 10);
      const compressedSize = parseInt(response.headers.get("X-Compressed-Size") || data.length.toString(), 10);

      setResult({
        success: true,
        files: [{ name: "compressed.pdf", data, type: "application/pdf" }],
        originalSize,
        compressedSize,
      });
      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to compress PDF";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, level]);

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

  const canProcess = files.length > 0 && (state as ProcessingState) !== "processing";

  const levelOptions: { value: CompressionLevel; label: string; description: string }[] = [
    { value: "basic", label: "Basic", description: "Minimal compression, fastest" },
    { value: "balanced", label: "Balanced", description: "Recommended for most cases" },
    { value: "strong", label: "Strong", description: "Maximum compression, may reduce quality" },
  ];

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
          <h3 className="font-semibold text-text">Compression Level</h3>
          
          <div className="space-y-2">
            {levelOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                  level === option.value
                    ? "border-accent bg-accent-light"
                    : "border-border hover:border-border-strong"
                }`}
              >
                <input
                  type="radio"
                  name="compression-level"
                  value={option.value}
                  checked={level === option.value}
                  onChange={() => setLevel(option.value)}
                  className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
                />
                <div>
                  <span className="font-medium text-text">{option.label}</span>
                  <p className="text-sm text-text-muted">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {preserved && (
        <div className="card p-4 border-warning bg-warning-light" role="alert">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-text">The optimized file is not smaller than the original. The original has been preserved.</p>
          </div>
        </div>
      )}

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
            Compress PDF
          </Button>
        </div>
      )}
    </div>
  );
}