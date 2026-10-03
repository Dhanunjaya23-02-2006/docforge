import { PDFDocument, PDFPage, rgb, StandardFonts, RotationTypes } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import { writeFile, unlink, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { formatFileSize } from "./utils";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ACCEPTED_PDF_TYPES = ["application/pdf"];
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/tiff", "image/bmp"];

export async function createTempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), "docforge-"));
}

export async function cleanupTempDir(dir: string): Promise<void> {
  try {
    const { rm } = await import("fs/promises");
    await rm(dir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

export async function saveTempFile(buffer: Buffer, dir: string, filename: string): Promise<string> {
  const filepath = join(dir, filename);
  await writeFile(filepath, buffer);
  return filepath;
}

export function validatePDF(buffer: Buffer): boolean {
  return buffer.length > 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
}

export function validateImage(buffer: Buffer): boolean {
  // JPEG
  if (buffer.length > 2 && buffer[0] === 0xff && buffer[1] === 0xd8) return true;
  // PNG
  if (buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // WebP
  if (buffer.length > 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return true;
  // GIF
  if (buffer.length > 6 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return true;
  // TIFF
  if (buffer.length > 2 && ((buffer[0] === 0x49 && buffer[1] === 0x49) || (buffer[0] === 0x4d && buffer[1] === 0x4d))) return true;
  // BMP
  if (buffer.length > 2 && buffer[0] === 0x42 && buffer[1] === 0x4d) return true;
  return false;
}

export async function mergePDFs(pdfBuffers: Buffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  mergedPdf.registerFontkit(fontkit);

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

export async function splitPDF(
  pdfBuffer: Buffer,
  pageRanges: string
): Promise<{ name: string; data: Uint8Array }[]> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const selectedPages = parsePageRanges(pageRanges, totalPages);

  if (selectedPages.length === 0) {
    throw new Error("No valid pages selected");
  }

  const results: { name: string; data: Uint8Array }[] = [];
  const newPdf = await PDFDocument.create();
  newPdf.registerFontkit(fontkit);

  for (const pageNum of selectedPages) {
    const [page] = await newPdf.copyPages(pdf, [pageNum - 1]);
    newPdf.addPage(page);
  }

  const data = await newPdf.save();
  results.push({ name: "extracted.pdf", data });

  return results;
}

export async function splitPDFByPages(
  pdfBuffer: Buffer,
  pagesPerFile: number
): Promise<{ name: string; data: Uint8Array }[]> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const results: { name: string; data: Uint8Array }[] = [];

  for (let i = 0; i < totalPages; i += pagesPerFile) {
    const newPdf = await PDFDocument.create();
    newPdf.registerFontkit(fontkit);

    const endPage = Math.min(i + pagesPerFile, totalPages);
    const pageIndices = Array.from({ length: endPage - i }, (_, k) => i + k);
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach((page) => newPdf.addPage(page));

    const data = await newPdf.save();
    results.push({ name: `pages-${i + 1}-${endPage}.pdf`, data });
  }

  return results;
}

export async function rotatePDF(
  pdfBuffer: Buffer,
  rotation: 90 | 180 | 270,
  pageNumbers?: number[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const pagesToRotate = pageNumbers || Array.from({ length: totalPages }, (_, i) => i + 1);

  for (const pageNum of pagesToRotate) {
    if (pageNum < 1 || pageNum > totalPages) continue;
    const page = pdf.getPage(pageNum - 1);
    const currentRotation = page.getRotation().angle;
    const newRotation = (currentRotation + rotation) % 360;
    page.setRotation({ angle: newRotation, type: "degrees" as RotationTypes });
  }

  return pdf.save();
}

export async function extractPDFPages(
  pdfBuffer: Buffer,
  pageRanges: string
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const selectedPages = parsePageRanges(pageRanges, totalPages);

  if (selectedPages.length === 0) {
    throw new Error("No valid pages selected");
  }

  const newPdf = await PDFDocument.create();
  newPdf.registerFontkit(fontkit);

  for (const pageNum of selectedPages) {
    const [page] = await newPdf.copyPages(pdf, [pageNum - 1]);
    newPdf.addPage(page);
  }

  return newPdf.save();
}

export async function removePDFPages(
  pdfBuffer: Buffer,
  pageRanges: string
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const pagesToRemove = new Set(parsePageRanges(pageRanges, totalPages));

  if (pagesToRemove.size >= totalPages) {
    throw new Error("Cannot remove all pages from the document");
  }

  const newPdf = await PDFDocument.create();
  newPdf.registerFontkit(fontkit);

  for (let i = 0; i < totalPages; i++) {
    if (!pagesToRemove.has(i + 1)) {
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
    }
  }

  return newPdf.save();
}

export async function imagesToPDF(
  imageBuffers: Buffer[],
  options: {
    pageSize?: "A4" | "Letter" | "Auto";
    orientation?: "portrait" | "landscape";
    margin?: number;
  } = {}
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const { pageSize = "A4", orientation = "portrait", margin = 20 } = options;

  const pageDimensions = {
    A4: { width: 595.28, height: 841.89 },
    Letter: { width: 612, height: 792 },
  };

  let pageWidth: number;
  let pageHeight: number;

  if (pageSize === "Auto") {
    // For auto, we'll use the first image dimensions later
    // For now, default to A4
    pageWidth = pageDimensions.A4.width;
    pageHeight = pageDimensions.A4.height;
  } else {
    const dimensions = pageDimensions[pageSize];
    const [w, h] = orientation === "landscape"
      ? [dimensions.height, dimensions.width]
      : [dimensions.width, dimensions.height];
    pageWidth = w;
    pageHeight = h;
  }

  for (const imageBuffer of imageBuffers) {
    let finalBuffer = imageBuffer;
    
    // Check if it's not a PNG (0x89 0x50) and not a JPEG (0xFF 0xD8)
    const isPng = imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50;
    const isJpeg = imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8;
    
    if (!isPng && !isJpeg) {
      // Convert to JPEG using sharp
      finalBuffer = await sharp(imageBuffer).jpeg({ quality: 95 }).toBuffer();
    }

    let image;
    if (isPng) {
      image = await pdf.embedPng(finalBuffer);
    } else {
      image = await pdf.embedJpg(finalBuffer);
    }

    const page = pdf.addPage([pageWidth, pageHeight]);
    const { width, height } = image.scale(1);

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const scale = Math.min(maxWidth / width, maxHeight / height, 1);

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    page.drawImage(image, { x, y, width: scaledWidth, height: scaledHeight });
  }

  return pdf.save();
}

export async function pdfToImages(
  pdfBuffer: Buffer,
  pageNumbers?: number[],
  format: "jpeg" | "png" = "jpeg",
  quality = 90
): Promise<{ name: string; data: Buffer }[]> {
  // For pdf to image conversion, we'll use a different approach
  // Since we can't use pdf2pic or poppler in this environment easily,
  // we'll create a placeholder that indicates this needs a proper PDF renderer
  // In production, you'd use pdf2pic, poppler, or similar
  
  const pdf = await PDFDocument.load(pdfBuffer);
  const totalPages = pdf.getPageCount();
  const pagesToConvert = pageNumbers || Array.from({ length: totalPages }, (_, i) => i + 1);

  // This is a fallback - in production you'd use a proper PDF renderer
  // For now, we'll throw an error indicating the need for a PDF rendering service
  throw new Error("PDF to image conversion requires a PDF rendering service (Poppler/pdf2pic). This feature needs server-side PDF rendering capability.");
}

export async function compressPDF(
  pdfBuffer: Buffer,
  level: "basic" | "balanced" | "strong"
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  
  // pdf-lib doesn't have built-in compression, but we can:
  // 1. Remove unused objects
  // 2. Compress streams
  // 3. Downsample images (requires image extraction/re-embedding)
  
  // For now, we'll use pdf-lib's save with compression options
  // In production, you might want to use Ghostscript or qpdf for better compression
  
  const options: any = {
    useObjectStreams: false,
    addDefaultPage: false,
  };

  // For stronger compression, we'd need to process images
  // This is a basic implementation
  return pdf.save(options);
}

export async function compressImage(
  imageBuffer: Buffer,
  quality: number,
  format?: "jpeg" | "png" | "webp",
  targetSize?: number
): Promise<{ data: Buffer; format: string }> {
  let sharpInstance = sharp(imageBuffer);
  const metadata = await sharpInstance.metadata();
  
  let outputFormat = format || (metadata.format || "jpeg");
  let currentQuality = quality;
  let result: Buffer;
  
  // If target size specified, iterate to find best quality
  if (targetSize && targetSize > 0) {
    let minQuality = 10;
    let maxQuality = 95;
    let bestResult: Buffer | null = null;
    let bestQuality = quality;
    
    // Binary search for optimal quality
    for (let i = 0; i < 8; i++) {
      const testQuality = Math.floor((minQuality + maxQuality) / 2);
      const testBuffer = await compressWithQuality(imageBuffer, outputFormat, testQuality);
      
      if (testBuffer.length <= targetSize) {
        bestResult = testBuffer;
        bestQuality = testQuality;
        minQuality = testQuality + 1;
      } else {
        maxQuality = testQuality - 1;
      }
      
      if (minQuality > maxQuality) break;
    }
    
    if (bestResult) {
      result = bestResult;
      currentQuality = bestQuality;
    } else {
      // Fallback to minimum quality
      result = await compressWithQuality(imageBuffer, outputFormat, 10);
      currentQuality = 10;
    }
  } else {
    result = await compressWithQuality(imageBuffer, outputFormat, currentQuality);
  }
  
  return { data: result, format: outputFormat };
}

async function compressWithQuality(
  imageBuffer: Buffer,
  format: string,
  quality: number
): Promise<Buffer> {
  let sharpInstance = sharp(imageBuffer);
  
  switch (format) {
    case "jpeg":
    case "jpg":
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
      break;
    case "png":
      sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
      break;
    case "webp":
      sharpInstance = sharpInstance.webp({ quality });
      break;
  }
  
  return sharpInstance.toBuffer();
}

export async function extractPDFText(pdfBuffer: Buffer): Promise<{ text: string; pageCount: number; hasText: boolean }> {
  const pdfParseImport = await import("pdf-parse");
  const pdfParse = (pdfParseImport as any).default || pdfParseImport;
  const data = await pdfParse(pdfBuffer);
  
  return {
    text: data.text,
    pageCount: data.numpages,
    hasText: data.text.trim().length > 0
  };
}

export function parsePageRanges(ranges: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = ranges.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        const s = Math.max(1, Math.min(start, totalPages));
        const e = Math.max(1, Math.min(end, totalPages));
        for (let i = s; i <= e; i++) pages.add(i);
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pages.add(pageNum);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}