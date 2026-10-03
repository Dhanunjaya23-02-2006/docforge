import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validateImage, imagesToPDF, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/pdf-utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const pageSize = formData.get("pageSize") as "A4" | "Letter" | "Auto" || "A4";
    const orientation = formData.get("orientation") as "portrait" | "landscape" || "portrait";
    const margin = parseInt(formData.get("margin") as string, 10) || 20;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 100) {
      return NextResponse.json({ error: "Maximum 100 images allowed" }, { status: 400 });
    }

    const imageBuffers: Buffer[] = [];

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a supported image format` },
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

      if (!validateImage(buffer)) {
        return NextResponse.json(
          { error: `File "${file.name}" appears to be corrupted or not a valid image` },
          { status: 400 }
        );
      }

      imageBuffers.push(buffer);
    }

    const pdf = await imagesToPDF(imageBuffers, { pageSize, orientation, margin });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="images.pdf"',
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("JPG to PDF error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to convert images to PDF. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}