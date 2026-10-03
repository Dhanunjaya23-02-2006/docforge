"use client";

import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PrivacyNotice } from "./PrivacyNotice";
import { FAQSection } from "./FAQSection";
import { RelatedTools } from "./RelatedTools";
import { AdSlot } from "./AdSlot";
import { Tool, FAQItem, RelatedTool } from "@/types";

interface ToolPageProps {
  tool: Tool;
  seo: {
    title: string;
    description: string;
  };
  faq: FAQItem[];
  relatedTools: RelatedTool[];
  children: ReactNode;
  showAd?: boolean;
}

export function ToolPage({
  tool,
  seo,
  faq,
  relatedTools,
  children,
  showAd = true,
}: ToolPageProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: tool.category.charAt(0).toUpperCase() + tool.category.slice(1), href: `/tools?category=${tool.category}` },
    { label: tool.name },
  ];

  return (
    <article className="min-h-screen">
      <div className="container pt-8 pb-16 lg:pt-12 lg:pb-20">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text mb-3">{tool.name}</h1>
          <p className="text-lg text-text-muted max-w-2xl">{tool.description}</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="card p-6 lg:p-8">
              {children}
            </div>

            <PrivacyNotice variant="card" className="mt-6" />

            {showAd && <AdSlot slot="tool-content-bottom" className="mt-6" />}

            <FAQSection items={faq} />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6 lg:p-8">
                <h3 className="font-semibold text-text mb-4">How it works</h3>
                <ol className="space-y-3 text-sm text-text-secondary">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-light text-accent text-xs font-medium flex items-center justify-center">1</span>
                    <span>Upload your file(s) using drag & drop or the file picker</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-light text-accent text-xs font-medium flex items-center justify-center">2</span>
                    <span>Adjust settings if needed</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-light text-accent text-xs font-medium flex items-center justify-center">3</span>
                    <span>Click process and wait for completion</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-light text-accent text-xs font-medium flex items-center justify-center">4</span>
                    <span>Download your result</span>
                  </li>
                </ol>
              </div>

              <div className="card p-6 lg:p-8">
                <h3 className="font-semibold text-text mb-4">Supported Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.category === "pdf" && (
                    <>
                      <span className="badge badge-neutral">PDF</span>
                    </>
                  )}
                  {tool.category === "images" && (
                    <>
                      <span className="badge badge-neutral">JPG</span>
                      <span className="badge badge-neutral">PNG</span>
                      <span className="badge badge-neutral">WebP</span>
                    </>
                  )}
                </div>
                <p className="mt-4 text-sm text-text-muted">
                  Maximum file size: 100MB per file
                </p>
              </div>

              {showAd && (
                <AdSlot slot="tool-sidebar" />
              )}
            </div>
          </aside>
        </div>

        <RelatedTools tools={relatedTools} />
      </div>
    </article>
  );
}