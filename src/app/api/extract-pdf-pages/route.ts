import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validatePDF, extractPDFPages, MAX_FILE_SIZE, ACCEPTED_PDF_TYPES } from "@/lib/pdf-utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const pageRanges = formData.get("pageRanges") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size of 100MB" }, { status: 400 });
    }

    if (!pageRanges || pageRanges.trim() === "") {
      return NextResponse.json({ error: "Page ranges are required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validatePDF(buffer)) {
      return NextResponse.json({ error: "File appears to be corrupted or not a valid PDF" }, { status: 400 });
    }

    const extractedPdf = await extractPDFPages(buffer, pageRanges);

    return new NextResponse(Buffer.from(extractedPdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="extracted.pdf"',
        "Content-Length": extractedPdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Extract PDF pages error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract pages. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}