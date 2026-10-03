import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { CompressPDFClient } from "./CompressPDFClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Compress PDF - Reduce PDF File Size Online Free | DocForge",
  description: "Compress PDF files with three compression levels: Basic, Balanced, and Strong. Reduce PDF file size online for free. No registration required.",
  openGraph: {
    title: "Compress PDF - Reduce PDF File Size Online Free | DocForge",
    description: "Compress PDF files with three compression levels: Basic, Balanced, and Strong. Reduce PDF file size online for free.",
    type: "website",
  },
};

export default function CompressPDFPage() {
  const tool = getTool("compress-pdf")!;
  const faq = getToolFAQ("compress-pdf");
  const relatedTools = getRelatedTools("compress-pdf");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <CompressPDFClient />
    </ToolPage>
  );
}