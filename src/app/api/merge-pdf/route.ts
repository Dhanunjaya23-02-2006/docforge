import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validatePDF, mergePDFs, MAX_FILE_SIZE, ACCEPTED_PDF_TYPES } from "@/lib/pdf-utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: "At least 2 PDF files are required" },
        { status: 400 }
      );
    }

    if (files.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 files allowed" },
        { status: 400 }
      );
    }

    const pdfBuffers: Buffer[] = [];

    for (const file of files) {
      if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a valid PDF` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds maximum size of 100MB` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (!validatePDF(buffer)) {
        return NextResponse.json(
          { error: `File "${file.name}" appears to be corrupted or not a valid PDF` },
          { status: 400 }
        );
      }

      pdfBuffers.push(buffer);
    }

    const mergedPdf = await mergePDFs(pdfBuffers);

    return new NextResponse(Buffer.from(mergedPdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
        "Content-Length": mergedPdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Merge PDF error:", error);
    return NextResponse.json(
      { error: "Failed to merge PDFs. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}