import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validatePDF, MAX_FILE_SIZE, ACCEPTED_PDF_TYPES } from "@/lib/pdf-utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const pageNumbersStr = formData.get("pageNumbers") as string;
    const format = (formData.get("format") as "jpeg" | "png") || "jpeg";
    const quality = parseInt(formData.get("quality") as string, 10) || 90;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size of 100MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validatePDF(buffer)) {
      return NextResponse.json({ error: "File appears to be corrupted or not a valid PDF" }, { status: 400 });
    }

    // Note: PDF to image conversion requires a PDF rendering engine like Poppler, MuPDF, or pdf2pic.
    // This is a server-side feature that needs native dependencies.
    // For now, we return an error explaining the requirement.
    
    return NextResponse.json(
      { 
        error: "PDF to image conversion requires a PDF rendering service (Poppler, MuPDF, or similar). This feature is not available in the current environment. Please use a dedicated PDF to image converter or install Poppler on the server.",
        requiresNativeDependency: true,
        dependency: "poppler-utils"
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("PDF to JPG error:", error);
    return NextResponse.json(
      { error: "Failed to convert PDF to images. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}