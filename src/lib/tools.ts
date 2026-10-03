import { Tool, ToolConfig, FAQItem, RelatedTool } from "@/types";

export const tools: Tool[] = [
  // PDF Tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document. Reorder files before merging.",
    icon: "merge",
    category: "pdf",
    route: "/tools/merge-pdf",
    popular: true,
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Split a PDF into multiple files. Extract specific pages or split by page ranges.",
    icon: "split",
    category: "pdf",
    route: "/tools/split-pdf",
    popular: true,
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate PDF pages by 90°, 180°, or 270°. Apply to selected pages or all pages.",
    icon: "rotate",
    category: "pdf",
    route: "/tools/rotate-pdf",
    popular: true,
  },
  {
    id: "extract-pdf-pages",
    name: "Extract PDF Pages",
    description: "Extract specific pages from a PDF to create a new document. Supports page ranges and individual pages.",
    icon: "extract",
    category: "pdf",
    route: "/tools/extract-pdf-pages",
    popular: true,
  },
  {
    id: "remove-pdf-pages",
    name: "Remove PDF Pages",
    description: "Delete unwanted pages from a PDF. Select pages to remove and keep the rest.",
    icon: "remove",
    category: "pdf",
    route: "/tools/remove-pdf-pages",
    popular: true,
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size with three compression levels. Optimize for web or storage.",
    icon: "compress",
    category: "pdf",
    route: "/tools/compress-pdf",
    popular: true,
  },
  {
    id: "pdf-to-text",
    name: "PDF Text Extraction",
    description: "Extract text content from PDF files. Copy or download as plain text.",
    icon: "text",
    category: "pdf",
    route: "/tools/pdf-to-text",
  },
  // Image Tools
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG, PNG, and WebP images to PDF. Multiple images per page with layout options.",
    icon: "image-to-pdf",
    category: "images",
    route: "/tools/jpg-to-pdf",
    popular: true,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert PDF pages to high-quality JPG images. Select specific pages or convert all.",
    icon: "pdf-to-image",
    category: "images",
    route: "/tools/pdf-to-jpg",
    popular: true,
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG, and WebP images. Control quality or target exact file size.",
    icon: "compress-image",
    category: "images",
    route: "/tools/image-compressor",
    popular: true,
  },
  // Coming Soon Tools
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word document (DOCX).",
    icon: "pdf-to-word",
    category: "documents",
    route: "/tools/pdf-to-word",
    comingSoon: true,
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents (DOCX) to PDF.",
    icon: "word-to-pdf",
    category: "documents",
    route: "/tools/word-to-pdf",
    comingSoon: true,
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Extract text from scanned PDFs using OCR.",
    icon: "ocr",
    category: "ocr",
    route: "/tools/ocr-pdf",
    comingSoon: true,
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    description: "Add electronic signatures to PDF documents.",
    icon: "sign",
    category: "pdf",
    route: "/tools/sign-pdf",
    comingSoon: true,
  },
  {
    id: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add text or image watermarks to PDF pages.",
    icon: "watermark",
    category: "pdf",
    route: "/tools/watermark-pdf",
    comingSoon: true,
  },
  {
    id: "page-numbers",
    name: "Add Page Numbers",
    description: "Add page numbers to PDF documents.",
    icon: "page-numbers",
    category: "pdf",
    route: "/tools/page-numbers",
    comingSoon: true,
  },
  {
    id: "remove-metadata",
    name: "Remove Metadata",
    description: "Strip metadata and hidden data from PDFs.",
    icon: "metadata",
    category: "pdf",
    route: "/tools/remove-metadata",
    comingSoon: true,
  },
];

export const toolConfigs: Record<string, ToolConfig> = {
  "merge-pdf": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: true,
    maxFiles: 50,
  },
  "split-pdf": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
  "rotate-pdf": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
  "extract-pdf-pages": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
  "remove-pdf-pages": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
  "compress-pdf": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
  "jpg-to-pdf": {
    maxFileSize: 50 * 1024 * 1024,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/tiff", "image/bmp"],
    multipleFiles: true,
    maxFiles: 100,
  },
  "pdf-to-jpg": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
  "image-compressor": {
    maxFileSize: 50 * 1024 * 1024,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/tiff", "image/bmp"],
    multipleFiles: false,
  },
  "pdf-to-text": {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  },
};

export const toolFAQs: Record<string, FAQItem[]> = {
  "merge-pdf": [
    { question: "How many PDFs can I merge at once?", answer: "You can merge up to 50 PDF files in a single operation." },
    { question: "Can I reorder the PDFs before merging?", answer: "Yes, you can drag and drop files to reorder them before merging." },
    { question: "Is there a file size limit?", answer: "Each PDF can be up to 100MB. The total combined size should not exceed browser limits." },
    { question: "Will the merged PDF preserve bookmarks and links?", answer: "Basic content is preserved. Bookmarks and interactive elements may not be retained." },
  ],
  "split-pdf": [
    { question: "How do I specify page ranges?", answer: "Use formats like '1-3', '5', '7-10' separated by commas. For example: '1-3,5,7-10' extracts pages 1,2,3,5,7,8,9,10." },
    { question: "Can I split every page into separate files?", answer: "Yes, select 'Split every page' to create one PDF per page." },
    { question: "What happens if I enter invalid page numbers?", answer: "Invalid page numbers are ignored. Only valid pages within the document range will be processed." },
    { question: "Can I split by a specific number of pages per file?", answer: "Yes, choose 'Split by pages' and enter the number of pages per output file." },
  ],
  "rotate-pdf": [
    { question: "Can I rotate only specific pages?", answer: "Yes, enter page numbers (e.g., '1,3,5' or '1-3') to rotate only those pages." },
    { question: "What rotation angles are supported?", answer: "90° (clockwise), 180°, and 270° (counter-clockwise)." },
    { question: "Does rotation affect the file size?", answer: "Rotation typically doesn't significantly change file size." },
    { question: "Is the rotation permanent in the downloaded PDF?", answer: "Yes, the downloaded PDF contains the rotated pages permanently." },
  ],
  "extract-pdf-pages": [
    { question: "How do I select pages to extract?", answer: "Enter page numbers or ranges like '1-3,5,7-10'. Duplicate pages are automatically removed." },
    { question: "Can I extract non-consecutive pages?", answer: "Yes, use comma-separated values like '1,3,5,7'." },
    { question: "What if I enter a page number that doesn't exist?", answer: "Invalid page numbers are ignored. Only existing pages will be extracted." },
    { question: "Will the extracted pages maintain their original order?", answer: "Yes, pages are extracted in ascending order regardless of input order." },
  ],
  "remove-pdf-pages": [
    { question: "How do I specify pages to remove?", answer: "Enter page numbers or ranges like '2,5,8-10' to remove those pages." },
    { question: "What happens if I try to remove all pages?", answer: "The tool will prevent you from removing all pages and show an error." },
    { question: "Can I undo the removal after processing?", answer: "No, but you can use the 'Process Another File' button to start over with the original file." },
    { question: "Will the remaining pages keep their original page numbers?", answer: "The page content order is preserved, but PDF page labels may be renumbered sequentially." },
  ],
  "compress-pdf": [
    { question: "What are the compression levels?", answer: "Basic (minimal compression), Balanced (recommended), Strong (maximum compression, may reduce quality)." },
    { question: "Will compression always reduce file size?", answer: "Not always. Already optimized PDFs may not shrink further. If the result isn't smaller, the original is preserved." },
    { question: "Does compression affect PDF quality?", answer: "Strong compression may reduce image quality. Balanced is recommended for most cases." },
    { question: "Can I compress password-protected PDFs?", answer: "No, password-protected PDFs must be unlocked first." },
  ],
  "jpg-to-pdf": [
    { question: "What image formats are supported?", answer: "JPG, PNG, WebP, GIF, TIFF, and BMP." },
    { question: "Can I add multiple images to one PDF?", answer: "Yes, upload multiple images. Each image becomes a separate page by default." },
    { question: "Can I reorder images before converting?", answer: "Yes, drag and drop to reorder images." },
    { question: "What page sizes are available?", answer: "A4, Letter, and Auto (fits image dimensions)." },
    { question: "Can I adjust margins?", answer: "Yes, you can set custom margins in points (1/72 inch)." },
  ],
  "pdf-to-jpg": [
    { question: "What image quality can I expect?", answer: "High-quality JPEG output at 90% quality by default." },
    { question: "Can I convert only specific pages?", answer: "Yes, enter page numbers or ranges to convert only selected pages." },
    { question: "What if my PDF has many pages?", answer: "Multiple pages are delivered as a ZIP file for easy download." },
    { question: "Why does this tool require Poppler?", answer: "PDF to image conversion needs a PDF rendering engine. Poppler is the standard open-source solution." },
  ],
  "image-compressor": [
    { question: "What compression modes are available?", answer: "Quality-based (set quality 10-95) or target file size (specify exact KB)." },
    { question: "Can I compress to an exact file size?", answer: "Yes, enter a target size in KB (e.g., 20, 50, 100, 200, 500, or custom). The tool will find the best quality." },
    { question: "What formats are supported?", answer: "JPG, PNG, and WebP input. Output can be JPG, PNG, or WebP." },
    { question: "Will compression always achieve the target size?", answer: "The tool attempts to reach the target while preserving maximum quality. If impossible without unacceptable quality loss, it will explain the actual result." },
  ],
  "pdf-to-text": [
    { question: "Can I extract text from scanned PDFs?", answer: "No, scanned PDFs require OCR (Optical Character Recognition). This tool only works with text-based PDFs." },
    { question: "What if the PDF has no extractable text?", answer: "The tool will inform you that the PDF appears to contain scanned images and OCR is needed." },
    { question: "Can I copy the extracted text?", answer: "Yes, use the 'Copy Text' button to copy all extracted text to clipboard." },
    { question: "Can I download the text as a file?", answer: "Yes, download the extracted text as a .txt file." },
  ],
};

export const toolRelatedTools: Record<string, RelatedTool[]> = {
  "merge-pdf": [
    { id: "split-pdf", name: "Split PDF", route: "/tools/split-pdf", description: "Split a PDF into multiple files" },
    { id: "extract-pdf-pages", name: "Extract PDF Pages", route: "/tools/extract-pdf-pages", description: "Extract specific pages from a PDF" },
    { id: "compress-pdf", name: "Compress PDF", route: "/tools/compress-pdf", description: "Reduce PDF file size" },
    { id: "pdf-to-jpg", name: "PDF to JPG", route: "/tools/pdf-to-jpg", description: "Convert PDF pages to images" },
  ],
  "split-pdf": [
    { id: "merge-pdf", name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDFs into one" },
    { id: "extract-pdf-pages", name: "Extract PDF Pages", route: "/tools/extract-pdf-pages", description: "Extract specific pages from a PDF" },
    { id: "remove-pdf-pages", name: "Remove PDF Pages", route: "/tools/remove-pdf-pages", description: "Delete unwanted pages from a PDF" },
    { id: "rotate-pdf", name: "Rotate PDF", route: "/tools/rotate-pdf", description: "Rotate PDF pages" },
  ],
  "rotate-pdf": [
    { id: "split-pdf", name: "Split PDF", route: "/tools/split-pdf", description: "Split a PDF into multiple files" },
    { id: "extract-pdf-pages", name: "Extract PDF Pages", route: "/tools/extract-pdf-pages", description: "Extract specific pages from a PDF" },
    { id: "remove-pdf-pages", name: "Remove PDF Pages", route: "/tools/remove-pdf-pages", description: "Delete unwanted pages from a PDF" },
    { id: "merge-pdf", name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDFs into one" },
  ],
  "extract-pdf-pages": [
    { id: "split-pdf", name: "Split PDF", route: "/tools/split-pdf", description: "Split a PDF into multiple files" },
    { id: "remove-pdf-pages", name: "Remove PDF Pages", route: "/tools/remove-pdf-pages", description: "Delete unwanted pages from a PDF" },
    { id: "merge-pdf", name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDFs into one" },
    { id: "rotate-pdf", name: "Rotate PDF", route: "/tools/rotate-pdf", description: "Rotate PDF pages" },
  ],
  "remove-pdf-pages": [
    { id: "extract-pdf-pages", name: "Extract PDF Pages", route: "/tools/extract-pdf-pages", description: "Extract specific pages from a PDF" },
    { id: "split-pdf", name: "Split PDF", route: "/tools/split-pdf", description: "Split a PDF into multiple files" },
    { id: "rotate-pdf", name: "Rotate PDF", route: "/tools/rotate-pdf", description: "Rotate PDF pages" },
    { id: "merge-pdf", name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDFs into one" },
  ],
  "compress-pdf": [
    { id: "merge-pdf", name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDFs into one" },
    { id: "split-pdf", name: "Split PDF", route: "/tools/split-pdf", description: "Split a PDF into multiple files" },
    { id: "pdf-to-jpg", name: "PDF to JPG", route: "/tools/pdf-to-jpg", description: "Convert PDF pages to images" },
    { id: "pdf-to-text", name: "PDF Text Extraction", route: "/tools/pdf-to-text", description: "Extract text content from PDF" },
  ],
  "jpg-to-pdf": [
    { id: "pdf-to-jpg", name: "PDF to JPG", route: "/tools/pdf-to-jpg", description: "Convert PDF pages to images" },
    { id: "merge-pdf", name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDFs into one" },
    { id: "compress-pdf", name: "Compress PDF", route: "/tools/compress-pdf", description: "Reduce PDF file size" },
    { id: "image-compressor", name: "Image Compressor", route: "/tools/image-compressor", description: "Compress images before converting" },
  ],
  "pdf-to-jpg": [
    { id: "jpg-to-pdf", name: "JPG to PDF", route: "/tools/jpg-to-pdf", description: "Convert images to PDF" },
    { id: "compress-pdf", name: "Compress PDF", route: "/tools/compress-pdf", description: "Reduce PDF file size" },
    { id: "pdf-to-text", name: "PDF Text Extraction", route: "/tools/pdf-to-text", description: "Extract text content from PDF" },
    { id: "split-pdf", name: "Split PDF", route: "/tools/split-pdf", description: "Split a PDF into multiple files" },
  ],
  "image-compressor": [
    { id: "jpg-to-pdf", name: "JPG to PDF", route: "/tools/jpg-to-pdf", description: "Convert images to PDF" },
    { id: "pdf-to-jpg", name: "PDF to JPG", route: "/tools/pdf-to-jpg", description: "Convert PDF pages to images" },
    { id: "compress-pdf", name: "Compress PDF", route: "/tools/compress-pdf", description: "Reduce PDF file size" },
  ],
  "pdf-to-text": [
    { id: "pdf-to-jpg", name: "PDF to JPG", route: "/tools/pdf-to-jpg", description: "Convert PDF pages to images" },
    { id: "compress-pdf", name: "Compress PDF", route: "/tools/compress-pdf", description: "Reduce PDF file size" },
    { id: "extract-pdf-pages", name: "Extract PDF Pages", route: "/tools/extract-pdf-pages", description: "Extract specific pages from a PDF" },
  ],
};

export function getTool(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolConfig(id: string): ToolConfig {
  return toolConfigs[id] || {
    maxFileSize: 100 * 1024 * 1024,
    acceptedTypes: ["application/pdf"],
    multipleFiles: false,
  };
}

export function getToolFAQ(id: string): FAQItem[] {
  return toolFAQs[id] || [];
}

export function getRelatedTools(id: string): RelatedTool[] {
  return toolRelatedTools[id] || [];
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category && !t.comingSoon);
}

export function getPopularTools(): Tool[] {
  return tools.filter((t) => t.popular && !t.comingSoon);
}