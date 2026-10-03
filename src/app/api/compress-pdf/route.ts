import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validatePDF, compressPDF, MAX_FILE_SIZE, ACCEPTED_PDF_TYPES } from "@/lib/pdf-utils";
import { formatFileSize } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const level = formData.get("level") as "basic" | "balanced" | "strong" || "balanced";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size of 100MB" }, { status: 400 });
    }

    if (!["basic", "balanced", "strong"].includes(level)) {
      return NextResponse.json({ error: "Invalid compression level" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validatePDF(buffer)) {
      return NextResponse.json({ error: "File appears to be corrupted or not a valid PDF" }, { status: 400 });
    }

    const originalSize = buffer.length;
    const compressedPdf = await compressPDF(buffer, level);
    const compressedSize = compressedPdf.length;

    // If compression didn't reduce size, return original
    if (compressedSize >= originalSize) {
      return NextResponse.json(
        { 
          error: "The optimized file is not smaller than the original. The original has been preserved.",
          originalSize,
          compressedSize: originalSize,
          reduction: 0,
          preserved: true
        },
        { status: 200 }
      );
    }

    return new NextResponse(Buffer.from(compressedPdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
        "Content-Length": compressedPdf.length.toString(),
        "X-Original-Size": originalSize.toString(),
        "X-Compressed-Size": compressedSize.toString(),
        "X-Reduction": Math.round((1 - compressedSize / originalSize) * 100).toString(),
      },
    });
  } catch (error) {
    console.error("Compress PDF error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to compress PDF. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}