import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validatePDF, rotatePDF, MAX_FILE_SIZE, ACCEPTED_PDF_TYPES } from "@/lib/pdf-utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rotation = parseInt(formData.get("rotation") as string, 10);
    const pageNumbersStr = formData.get("pageNumbers") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size of 100MB" }, { status: 400 });
    }

    if (![90, 180, 270].includes(rotation)) {
      return NextResponse.json({ error: "Rotation must be 90, 180, or 270 degrees" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validatePDF(buffer)) {
      return NextResponse.json({ error: "File appears to be corrupted or not a valid PDF" }, { status: 400 });
    }

    let pageNumbers: number[] | undefined;
    if (pageNumbersStr) {
      pageNumbers = pageNumbersStr.split(",").map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));
    }

    const rotatedPdf = await rotatePDF(buffer, rotation as 90 | 180 | 270, pageNumbers);

    return new NextResponse(Buffer.from(rotatedPdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated.pdf"',
        "Content-Length": rotatedPdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Rotate PDF error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rotate PDF. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}