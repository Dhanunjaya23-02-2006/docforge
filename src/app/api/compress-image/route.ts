import { NextRequest, NextResponse } from "next/server";
import { createTempDir, cleanupTempDir, validateImage, compressImage, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/pdf-utils";
import { formatFileSize } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const tempDir = await createTempDir();
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const quality = parseInt(formData.get("quality") as string, 10) || 80;
    const format = formData.get("format") as "jpeg" | "png" | "webp" | undefined;
    const targetSizeStr = formData.get("targetSize") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size of 100MB" }, { status: 400 });
    }

    if (quality < 10 || quality > 95) {
      return NextResponse.json({ error: "Quality must be between 10 and 95" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateImage(buffer)) {
      return NextResponse.json({ error: "File appears to be corrupted or not a valid image" }, { status: 400 });
    }

    const originalSize = buffer.length;
    const targetSize = targetSizeStr ? parseInt(targetSizeStr, 10) * 1024 : undefined; // Convert KB to bytes

    const { data: compressedBuffer, format: outputFormat } = await compressImage(
      buffer,
      quality,
      format,
      targetSize
    );

    const compressedSize = compressedBuffer.length;

    // If compression didn't reduce size significantly, return original
    if (compressedSize >= originalSize * 0.98) {
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="${file.name}"`,
          "Content-Length": buffer.length.toString(),
          "X-Original-Size": originalSize.toString(),
          "X-Compressed-Size": originalSize.toString(),
          "X-Reduction": "0",
          "X-Preserved": "true",
        },
      });
    }

    const mimeType = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
    const extension = outputFormat === "png" ? "png" : outputFormat === "webp" ? "webp" : "jpg";
    const filename = file.name.replace(/\.[^.]+$/, "") + `-compressed.${extension}`;

    return new NextResponse(compressedBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": compressedSize.toString(),
        "X-Original-Size": originalSize.toString(),
        "X-Compressed-Size": compressedSize.toString(),
        "X-Reduction": Math.round((1 - compressedSize / originalSize) * 100).toString(),
      },
    });
  } catch (error) {
    console.error("Compress image error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to compress image. Please try again." },
      { status: 500 }
    );
  } finally {
    await cleanupTempDir(tempDir);
  }
}