import { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { PDFToJPGClient } from "./PDFToJPGClient";
import { getTool, getToolFAQ, getRelatedTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "PDF to JPG - Convert PDF to Images Online Free | DocForge",
  description: "Convert PDF pages to high-quality JPG or PNG images. Select specific pages or convert all. Free online PDF to image converter.",
  openGraph: {
    title: "PDF to JPG - Convert PDF to Images Online Free | DocForge",
    description: "Convert PDF pages to high-quality JPG or PNG images. Select specific pages or convert all.",
    type: "website",
  },
};

export default function PDFToJPGPage() {
  const tool = getTool("pdf-to-jpg")!;
  const faq = getToolFAQ("pdf-to-jpg");
  const relatedTools = getRelatedTools("pdf-to-jpg");

  return (
    <ToolPage tool={tool} seo={{ title: metadata.title as string, description: metadata.description as string }} faq={faq} relatedTools={relatedTools}>
      <PDFToJPGClient />
    </ToolPage>
  );
}