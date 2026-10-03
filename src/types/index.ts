export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  route: string;
  popular?: boolean;
  comingSoon?: boolean;
}

export type ToolCategory =
  | "pdf"
  | "images"
  | "documents"
  | "ocr"
  | "generators"
  | "templates";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  error?: string;
  status: "idle" | "uploading" | "validating" | "processing" | "completed" | "failed";
  progress?: number;
}

export interface ProcessingResult {
  success: boolean;
  files?: {
    name: string;
    data: Uint8Array;
    type: string;
  }[];
  zipData?: Uint8Array;
  zipName?: string;
  text?: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
  pageCount?: number;
}

export interface ToolConfig {
  maxFileSize: number;
  acceptedTypes: string[];
  multipleFiles: boolean;
  maxFiles?: number;
}

export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterCard: "summary" | "summary_large_image";
  twitterTitle: string;
  twitterDescription: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedTool {
  id: string;
  name: string;
  route: string;
  description: string;
}

export type ProcessingState = "idle" | "uploading" | "validating" | "processing" | "completed" | "failed" | "cancelled";

export interface PageSelection {
  pages: number[];
  ranges: string;
}