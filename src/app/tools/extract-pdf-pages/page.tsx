import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { ExtractPDFPagesClient } from "./ExtractPDFPagesClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Extract PDF Pages - Extract Specific Pages from PDF Online Free | DocForge",
  description: "Extract specific pages from a PDF to create a new document. Supports page ranges and individual pages. Free online tool.",
  openGraph: {
    title: "Extract PDF Pages - Extract Specific Pages from PDF Online Free | DocForge",
    description: "Extract specific pages from a PDF to create a new document. Supports page ranges and individual pages.",
    type: "website",
  },
};

export default function ExtractPDFPagesPage() {
  const tool = getTool("extract-pdf-pages")!;
  const faq = getToolFAQ("extract-pdf-pages");
  const relatedTools = getRelatedTools("extract-pdf-pages");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <ExtractPDFPagesClient />
    </ToolPage>
  );
}