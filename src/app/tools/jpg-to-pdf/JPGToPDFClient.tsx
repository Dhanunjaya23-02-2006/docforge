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

export function JPGToPDFClient() {
  const config = getToolConfig("jpg-to-pdf");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Auto">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(20);

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
    if (files.length === 0) {
      setError("Please upload at least one image");
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
      formData.append("pageSize", pageSize);
      formData.append("orientation", orientation);
      formData.append("margin", margin.toString());

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/jpg-to-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to convert images to PDF");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      setResult({
        success: true,
        files: [{ name: "images.pdf", data, type: "application/pdf" }],
      });
      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to convert images to PDF";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, pageSize, orientation, margin]);

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
          <h3 className="font-semibold text-text">PDF Options</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "A4" | "Letter" | "Auto")}
                className="input"
              >
                <option value="A4">A4 (210 × 297 mm)</option>
                <option value="Letter">Letter (8.5 × 11 in)</option>
                <option value="Auto">Auto (fit image)</option>
              </select>
            </div>
            
            <div>
              <label className="label">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
                className="input"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Margin (points)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value, 10) || 0)}
              helperText="Margin around each image (1 point = 1/72 inch). Default: 20"
            />
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
            Convert to PDF
          </Button>
        </div>
      )}
    </div>
  );
}