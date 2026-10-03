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

type SplitMode = "range" | "every" | "pages";

export function SplitPDFClient() {
  const config = getToolConfig("split-pdf");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [mode, setMode] = useState<SplitMode>("range");
  const [pageRanges, setPageRanges] = useState("");
  const [pagesPerFile, setPagesPerFile] = useState("1");

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
    setPagesPerFile("1");
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload a PDF file");
      return;
    }

    if (mode === "range" && !pageRanges.trim()) {
      setError("Please enter page ranges (e.g., 1-3,5,7-10)");
      return;
    }

    if (mode === "pages" && (!pagesPerFile.trim() || parseInt(pagesPerFile, 10) < 1)) {
      setError("Please enter a valid number of pages per file");
      return;
    }

    setState("uploading");
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("mode", mode);
      if (mode === "range") formData.append("pageRanges", pageRanges);
      if (mode === "pages") formData.append("pagesPerFile", pagesPerFile);

      setState("processing");
      setProgress(30);

      const response = await fetch("/api/split-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to split PDF");
      }

      const contentType = response.headers.get("content-type") || "";
      
      if (contentType.includes("zip")) {
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        setResult({
          success: true,
          zipData: data,
          zipName: "split-pages.zip",
        });
      } else {
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const disposition = response.headers.get("content-disposition") || "";
        const filename = disposition.match(/filename="(.+)"/)?.[1] || "split.pdf";
        setResult({
          success: true,
          files: [{ name: filename, data, type: "application/pdf" }],
        });
      }

      setState("completed");
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to split PDF";
      setError(message);
      setState("failed");
      setProgress(-1);
    }
  }, [files, mode, pageRanges, pagesPerFile]);

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

  const handleDownloadZip = useCallback(() => {
    if (!result?.zipData) return;
    const url = URL.createObjectURL(new Blob([result.zipData as unknown as ArrayBuffer], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = result.zipName || "split-pages.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const canProcess = files.length > 0 && 
    ((mode === "range" && pageRanges.trim()) || (mode === "pages" && parseInt(pagesPerFile, 10) >= 1) || mode === "every") &&
    (state as ProcessingState) !== "processing";

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
          <h3 className="font-semibold text-text">Split Options</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="split-mode"
                value="range"
                checked={mode === "range"}
                onChange={() => setMode("range")}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="text-text">Extract specific pages</span>
            </label>
            
            {mode === "range" && (
              <Input
                label="Page Ranges"
                placeholder="e.g., 1-3,5,7-10"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                helperText="Use formats like 1-3, 5, 7-10. Separate with commas."
              />
            )}

            <Divider label="or" />
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="split-mode"
                value="every"
                checked={mode === "every"}
                onChange={() => setMode("every")}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="text-text">Split every page into separate files</span>
            </label>

            <Divider label="or" />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="split-mode"
                value="pages"
                checked={mode === "pages"}
                onChange={() => setMode("pages")}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="text-text">Split by number of pages per file</span>
            </label>

            {mode === "pages" && (
              <Input
                label="Pages per file"
                type="number"
                min="1"
                value={pagesPerFile}
                onChange={(e) => setPagesPerFile(e.target.value)}
                helperText="Each output file will contain this many pages"
              />
            )}
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

      {result && <ResultCard result={result} onDownload={handleDownload} onDownloadZip={handleDownloadZip} onReset={handleReset} processing={state === "processing"} />}

      {files.length > 0 && state === "idle" && (
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleProcess}
            disabled={!canProcess || (state as ProcessingState) === "processing"}
            className="w-full sm:w-auto"
          >
            Split PDF
          </Button>
        </div>
      )}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-text-muted text-sm">
      <div className="flex-1 border-t border-border" />
      <span>{label}</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}