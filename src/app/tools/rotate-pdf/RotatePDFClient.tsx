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

type Rotation = 90 | 180 | 270;

export function RotatePDFClient() {
  const config = getToolConfig("rotate-pdf");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [rotation, setRotation] = useState<Rotation>(90);
  const [pageNumbers, setPageNumbers] = useState("");
  const [applyToAll, setApplyToAll] = useState(true);

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
    setRotation(90);
    setPageNumbers("");
    setApplyToAll(true);
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload a PDF file");
      return;
    }

    if (!applyToAll && !pageNumbers.trim()) {
      setError("Please enter page numbers to rotate (e.g., 1,3,5 or 1-3)");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("rotation", rotation.toString());
      if (!applyToAll) formData.append("pageNumbers", pageNumbers);

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/rotate-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rotate PDF");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      setResult({
        success: true,
        files: [{ name: "rotated.pdf", data, type: "application/pdf" }],
      });
      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to rotate PDF";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, rotation, pageNumbers, applyToAll]);

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

  const canProcess = files.length > 0 && (applyToAll || pageNumbers.trim()) && (state as ProcessingState) !== "processing";

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
          <h3 className="font-semibold text-text">Rotation Options</h3>
          
          <div>
            <label className="label">Rotation Angle</label>
            <div className="flex gap-3 flex-wrap">
              {([90, 180, 270] as Rotation[]).map((angle) => (
                <label
                  key={angle}
                  className={`flex items-center gap-2 px-4 py-2 rounded border cursor-pointer transition-colors ${
                    rotation === angle
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border hover:border-border-strong"
                  }`}
                >
                  <input
                    type="radio"
                    name="rotation"
                    value={angle}
                    checked={rotation === angle}
                    onChange={() => setRotation(angle)}
                    className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
                  />
                  <span>{angle}°</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="h-4 w-4 text-accent border-border-strong rounded focus:ring-accent"
              />
              <span className="text-text">Apply to all pages</span>
            </label>
          </div>

          {!applyToAll && (
            <Input
              label="Page Numbers"
              placeholder="e.g., 1,3,5 or 1-3,5-7"
              value={pageNumbers}
              onChange={(e) => setPageNumbers(e.target.value)}
              helperText="Enter page numbers or ranges separated by commas"
            />
          )}
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
            Rotate PDF
          </Button>
        </div>
      )}
    </div>
  );
}