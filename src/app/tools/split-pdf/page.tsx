import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { SplitPDFClient } from "./SplitPDFClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Split PDF - Split PDF Pages Online Free | DocForge",
  description: "Split a PDF into multiple files. Extract specific pages, split by page ranges, or split every page into separate PDFs. Free online tool.",
  openGraph: {
    title: "Split PDF - Split PDF Pages Online Free | DocForge",
    description: "Split a PDF into multiple files. Extract specific pages, split by page ranges, or split every page into separate PDFs.",
    type: "website",
  },
};

export default function SplitPDFPage() {
  const tool = getTool("split-pdf")!;
  const faq = getToolFAQ("split-pdf");
  const relatedTools = getRelatedTools("split-pdf");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <SplitPDFClient />
    </ToolPage>
  );
}