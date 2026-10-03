# DocForge

Everything you need to work with documents. Free online PDF, document and image tools — fast, simple and secure.

## Features

### PDF Tools (Implemented)
- **Merge PDF** - Combine multiple PDF files into one
- **Split PDF** - Split PDF by page ranges, every page, or pages per file
- **Rotate PDF** - Rotate pages by 90°, 180°, or 270°
- **Extract PDF Pages** - Extract specific pages to new PDF
- **Remove PDF Pages** - Delete unwanted pages
- **Compress PDF** - Reduce file size with 3 compression levels
- **PDF Text Extraction** - Extract text from text-based PDFs

### Image Tools (Implemented)
- **JPG to PDF** - Convert images to PDF with layout options
- **PDF to JPG** - Convert PDF pages to images (requires Poppler)
- **Image Compressor** - Compress by quality or target file size

### Coming Soon
- PDF to Word / Word to PDF
- OCR PDF
- Sign PDF
- Watermark PDF
- Add Page Numbers
- Remove Metadata
- Document Generators (Resume, Invoice, Certificate, etc.)
- Templates

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **PDF Processing**: pdf-lib
- **Image Processing**: Sharp
- **Archiving**: archiver (ZIP)
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
cd docforge

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes for file processing
│   │   ├── merge-pdf/
│   │   ├── split-pdf/
│   │   ├── rotate-pdf/
│   │   ├── extract-pdf-pages/
│   │   ├── remove-pdf-pages/
│   │   ├── jpg-to-pdf/
│   │   ├── pdf-to-jpg/
│   │   ├── compress-pdf/
│   │   ├── compress-image/
│   │   └── pdf-to-text/
│   ├── tools/               # Tool pages
│   │   ├── merge-pdf/
│   │   ├── split-pdf/
│   │   ├── rotate-pdf/
│   │   ├── extract-pdf-pages/
│   │   ├── remove-pdf-pages/
│   │   ├── jpg-to-pdf/
│   │   ├── pdf-to-jpg/
│   │   ├── compress-pdf/
│   │   ├── image-compressor/
│   │   └── pdf-to-text/
│   ├── globals.css          # Global styles & design tokens
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── layout/              # Header, Footer, Layout
│   ├── tools/               # Tool-specific components
│   ├── ui/                  # Reusable UI components
│   └── upload/              # File upload components
├── lib/
│   ├── pdf-utils.ts         # PDF/Image processing utilities
│   └── tools.ts             # Tool definitions & metadata
└── types/
    └── index.ts             # TypeScript types
```

## PDF Processing Architecture

### Server-Side Processing
All file processing happens server-side in API routes (`/api/*`). This ensures:
- No heavy libraries sent to client
- Secure file handling
- Consistent processing environment

### Libraries Used
- **pdf-lib**: PDF manipulation (merge, split, rotate, extract, remove pages, images to PDF)
- **Sharp**: Image compression and format conversion
- **archiver**: ZIP file creation for multi-file downloads
- **pdf-parse**: PDF text extraction

### Limitations
- **PDF to JPG**: Requires Poppler (`pdftoppm`) for PDF rendering. Not available in pure Node.js environment. The backend route abstraction is fully implemented and correctly throws an informative error in the UI.

To enable full image rendering in production, install Poppler and configure the server accordingly.

## File Security

- MIME type validation (server & client)
- File extension validation
- File size limits (100MB default)
- Magic byte validation for PDFs and images
- Temporary file cleanup after processing
- No permanent storage of uploaded files

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `NEXT_PUBLIC_APP_URL` - Application URL
- `MAX_FILE_SIZE_MB` - Maximum file size in MB
- `TEMP_DIR` - Temporary file directory

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy

**Note**: Vercel serverless functions have a 50MB request body limit and 10s/60s execution timeout. For large files, consider:
- External processing service (AWS Lambda, Cloud Run)
- Streaming uploads to object storage

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Requirements for Full Functionality
For PDF to JPG and OCR features, install system dependencies:
```bash
# Ubuntu/Debian
apt-get install -y poppler-utils

# Alpine
apk add poppler-utils
```

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Design System

DocForge uses a custom design system built on Tailwind CSS v4 with CSS variables for theming:

- **Colors**: Semantic color tokens (bg, text, accent, success, error, warning)
- **Spacing**: Consistent spacing scale
- **Typography**: System font stack
- **Components**: Button, Input, Card, Badge, Progress, Spinner, etc.
- **Responsive**: Mobile-first breakpoints

## Accessibility

- Semantic HTML
- Keyboard navigation
- ARIA labels and roles
- Focus management
- Color contrast compliance
- Screen reader support

## License

MIT License - see LICENSE file for details.