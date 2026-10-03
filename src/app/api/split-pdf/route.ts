import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validatePDF, splitPDF, splitPDFByPages, MAX_FILE_SIZE, ACCEPTED_PDF_TYPES } from "@/lib/pdf-utils";
import { ZipArchive } from "archiver";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const mode = formData.get("mode") as string; // "range" | "every" | "pages"
    const pageRanges = formData.get("pageRanges") as string;
    const pagesPerFile = formData.get("pagesPerFile") as string;

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

    let results: { name: string; data: Uint8Array }[];

    if (mode === "range" && pageRanges) {
      results = await splitPDF(buffer, pageRanges);
    } else if (mode === "pages" && pagesPerFile) {
      const pages = parseInt(pagesPerFile, 10);
      if (isNaN(pages) || pages < 1) {
        return NextResponse.json({ error: "Invalid pages per file" }, { status: 400 });
      }
      results = await splitPDFByPages(buffer, pages);
    } else if (mode === "every") {
      results = await splitPDFByPages(buffer, 1);
    } else {
      return NextResponse.json({ error: "Invalid split mode" }, { status: 400 });
    }

    if (results.length === 1) {
      return new NextResponse(Buffer.from(results[0].data), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${results[0].name}"`,
          "Content-Length": results[0].data.length.toString(),
        },
      });
    }

    // Multiple files - create ZIP
    const archive = new ZipArchive({ zlib: { level: 6 } });
    
    const chunks: Buffer[] = [];
    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    
    const archivePromise = new Promise<void>((resolve, reject) => {
      archive.on("end", () => resolve());
      archive.on("error", reject);
    });

    results.forEach((result) => {
      archive.append(Buffer.from(result.data), { name: result.name });
    });

    archive.finalize();
    await archivePromise;

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="split-pages.zip"',
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Split PDF error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to split PDF. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}