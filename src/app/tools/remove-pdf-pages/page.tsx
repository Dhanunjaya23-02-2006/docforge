import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { RemovePDFPagesClient } from "./RemovePDFPagesClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Remove PDF Pages - Delete Pages from PDF Online Free | DocForge",
  description: "Remove unwanted pages from a PDF. Select pages to delete and keep the rest. Free online tool to delete PDF pages.",
  openGraph: {
    title: "Remove PDF Pages - Delete Pages from PDF Online Free | DocForge",
    description: "Remove unwanted pages from a PDF. Select pages to delete and keep the rest.",
    type: "website",
  },
};

export default function RemovePDFPagesPage() {
  const tool = getTool("remove-pdf-pages")!;
  const faq = getToolFAQ("remove-pdf-pages");
  const relatedTools = getRelatedTools("remove-pdf-pages");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <RemovePDFPagesClient />
    </ToolPage>
  );
}