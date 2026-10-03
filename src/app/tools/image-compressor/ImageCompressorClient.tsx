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

type CompressMode = "quality" | "target";

export function ImageCompressorClient() {
  const config = getToolConfig("image-compressor");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [mode, setMode] = useState<CompressMode>("quality");
  const [quality, setQuality] = useState(80);
  const [targetSize, setTargetSize] = useState("");
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
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
    setPreserved(false);
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload an image");
      return;
    }

    if (mode === "target" && (!targetSize.trim() || parseInt(targetSize, 10) < 1)) {
      setError("Please enter a valid target size in KB");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);
    setPreserved(false);

    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("quality", quality.toString());
      formData.append("format", format);
      if (mode === "target" && targetSize.trim()) {
        formData.append("targetSize", targetSize);
      }

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/compress-image", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compress image");
      }

      const preservedHeader = response.headers.get("X-Preserved");
      if (preservedHeader === "true") {
        setPreserved(true);
        const arrayBuffer = await files[0].file.arrayBuffer();
        setResult({
          success: true,
          files: [{ name: files[0].name, data: new Uint8Array(arrayBuffer), type: files[0].type }],
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
      const contentType = response.headers.get("Content-Type") || "image/jpeg";
      const disposition = response.headers.get("content-disposition") || "";
      const filename = disposition.match(/filename="(.+)"/)?.[1] || "compressed.jpg";

      setResult({
        success: true,
        files: [{ name: filename, data, type: contentType }],
        originalSize,
        compressedSize,
      });
      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to compress image";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, mode, quality, targetSize, format]);

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

  const targetSizes = [20, 50, 100, 200, 500];

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
          <h3 className="font-semibold text-text">Compression Mode</h3>
          
          <div className="flex gap-4 flex-wrap">
            <label className={`flex items-center gap-2 px-4 py-2 rounded border cursor-pointer transition-colors ${
              mode === "quality" ? "border-accent bg-accent-light" : "border-border hover:border-border-strong"
            }`}>
              <input
                type="radio"
                name="compress-mode"
                value="quality"
                checked={mode === "quality"}
                onChange={() => setMode("quality")}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="font-medium text-text">By Quality</span>
            </label>
            <label className={`flex items-center gap-2 px-4 py-2 rounded border cursor-pointer transition-colors ${
              mode === "target" ? "border-accent bg-accent-light" : "border-border hover:border-border-strong"
            }`}>
              <input
                type="radio"
                name="compress-mode"
                value="target"
                checked={mode === "target"}
                onChange={() => setMode("target")}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="font-medium text-text">Exact File Size</span>
            </label>
          </div>

          {mode === "quality" && (
            <div className="space-y-4">
              <div>
                <label className="label">Quality: {quality}%</label>
                <Input
                  type="range"
                  min="10"
                  max="95"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                />
              </div>
              
              <div>
                <label className="label">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "jpeg" | "png" | "webp")}
                  className="input"
                >
                  <option value="jpeg">JPEG (best for photos)</option>
                  <option value="png">PNG (lossless, transparency)</option>
                  <option value="webp">WebP (modern, efficient)</option>
                </select>
              </div>
            </div>
          )}

          {mode === "target" && (
            <div className="space-y-4">
              <Input
                label="Target Size (KB)"
                type="number"
                min="1"
                max="50000"
                placeholder="e.g., 100"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                helperText="Enter exact target size in kilobytes"
              />
              
              <div>
                <label className="label">Quick Targets</label>
                <div className="flex flex-wrap gap-2">
                  {targetSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTargetSize(size.toString())}
                      className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                        targetSize === size.toString()
                          ? "border-accent bg-accent-light text-accent"
                          : "border-border hover:border-border-strong"
                      }`}
                    >
                      {size} KB
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "jpeg" | "png" | "webp")}
                  className="input"
                >
                  <option value="jpeg">JPEG (best for photos)</option>
                  <option value="png">PNG (lossless, transparency)</option>
                  <option value="webp">WebP (modern, efficient)</option>
                </select>
              </div>

              <p className="text-sm text-text-muted">
                The compressor will attempt to reach the target size while preserving maximum quality. 
                If the exact target cannot be achieved without unacceptable quality loss, the actual resulting size will be shown.
              </p>
            </div>
          )}
        </div>
      )}

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {preserved && (
        <div className="card p-4 border-warning bg-warning-light" role="alert">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-text">Compression did not significantly reduce file size. The original has been preserved.</p>
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
            Compress Image
          </Button>
        </div>
      )}
    </div>
  );
}