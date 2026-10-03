import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { ImageCompressorClient } from "./ImageCompressorClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Image Compressor - Compress JPG, PNG, WebP Online Free | DocForge",
  description: "Compress images by quality or exact file size. Support for JPG, PNG, WebP. Target sizes: 20KB, 50KB, 100KB, 200KB, 500KB, or custom. Free online image compressor.",
  openGraph: {
    title: "Image Compressor - Compress JPG, PNG, WebP Online Free | DocForge",
    description: "Compress images by quality or exact file size. Support for JPG, PNG, WebP. Target sizes: 20KB, 50KB, 100KB, 200KB, 500KB, or custom.",
    type: "website",
  },
};

export default function ImageCompressorPage() {
  const tool = getTool("image-compressor")!;
  const faq = getToolFAQ("image-compressor");
  const relatedTools = getRelatedTools("image-compressor");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <ImageCompressorClient />
    </ToolPage>
  );
}