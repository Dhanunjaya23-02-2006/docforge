import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { MergePDFClient } from "./MergePDFClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Merge PDF - Combine Multiple PDF Files Online Free | DocForge",
  description: "Merge multiple PDF files into a single document. Reorder files, combine PDFs online for free. No registration required.",
  openGraph: {
    title: "Merge PDF - Combine Multiple PDF Files Online Free | DocForge",
    description: "Merge multiple PDF files into a single document. Reorder files, combine PDFs online for free.",
    type: "website",
  },
};

export default function MergePDFPage() {
  const tool = getTool("merge-pdf")!;
  const faq = getToolFAQ("merge-pdf");
  const relatedTools = getRelatedTools("merge-pdf");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <MergePDFClient />
    </ToolPage>
  );
}