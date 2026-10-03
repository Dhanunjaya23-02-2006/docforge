import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { RotatePDFClient } from "./RotatePDFClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Rotate PDF - Rotate PDF Pages Online Free | DocForge",
  description: "Rotate PDF pages by 90°, 180°, or 270°. Apply rotation to selected pages or all pages. Free online PDF rotation tool.",
  openGraph: {
    title: "Rotate PDF - Rotate PDF Pages Online Free | DocForge",
    description: "Rotate PDF pages by 90°, 180°, or 270°. Apply rotation to selected pages or all pages.",
    type: "website",
  },
};

export default function RotatePDFPage() {
  const tool = getTool("rotate-pdf")!;
  const faq = getToolFAQ("rotate-pdf");
  const relatedTools = getRelatedTools("rotate-pdf");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <RotatePDFClient />
    </ToolPage>
  );
}