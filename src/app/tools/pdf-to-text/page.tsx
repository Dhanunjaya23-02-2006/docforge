import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { PDFToTextClient } from "./PDFToTextClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "PDF to Text - Extract Text from PDF Online Free | DocForge",
  description: "Extract text content from PDF files. Copy or download as plain text. Works with text-based PDFs. Free online PDF text extractor.",
  openGraph: {
    title: "PDF to Text - Extract Text from PDF Online Free | DocForge",
    description: "Extract text content from PDF files. Copy or download as plain text. Works with text-based PDFs.",
    type: "website",
  },
};

export default function PDFToTextPage() {
  const tool = getTool("pdf-to-text")!;
  const faq = getToolFAQ("pdf-to-text");
  const relatedTools = getRelatedTools("pdf-to-text");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <PDFToTextClient />
    </ToolPage>
  );
}