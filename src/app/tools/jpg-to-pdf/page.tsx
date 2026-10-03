import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { JPGToPDFClient } from "./JPGToPDFClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "JPG to PDF - Convert Images to PDF Online Free | DocForge",
  description: "Convert JPG, PNG, WebP and other images to PDF. Multiple images, custom page size, orientation and margins. Free online image to PDF converter.",
  openGraph: {
    title: "JPG to PDF - Convert Images to PDF Online Free | DocForge",
    description: "Convert JPG, PNG, WebP and other images to PDF. Multiple images, custom page size, orientation and margins.",
    type: "website",
  },
};

export default function JPGToPDFPage() {
  const tool = getTool("jpg-to-pdf")!;
  const faq = getToolFAQ("jpg-to-pdf");
  const relatedTools = getRelatedTools("jpg-to-pdf");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <JPGToPDFClient />
    </ToolPage>
  );
}