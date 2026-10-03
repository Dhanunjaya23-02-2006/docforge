"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getToolsByCategory, getPopularTools } from "@/lib/tools";
import { Tool } from "@/types";
import { AdSlot } from "@/components/tools/AdSlot";

const categories = [
  { id: "pdf", name: "PDF Tools", icon: "📄" },
  { id: "images", name: "Image Tools", icon: "🖼️" },
  { id: "documents", name: "Document Tools", icon: "📝" },
  { id: "ocr", name: "OCR", icon: "🔍" },
  { id: "generators", name: "Generators", icon: "⚡" },
  { id: "templates", name: "Templates", icon: "📋" },
];

const popularTools = getPopularTools();
const allTools = [
  ...getToolsByCategory("pdf"),
  ...getToolsByCategory("images"),
  ...getToolsByCategory("documents"),
  ...getToolsByCategory("ocr"),
  ...getToolsByCategory("generators"),
  ...getToolsByCategory("templates"),
];

function ToolCard({ tool }: { tool: Tool }) {
  const icons: Record<string, React.ReactNode> = {
    merge: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    split: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    rotate: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    extract: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    remove: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    compress: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    "image-to-pdf": (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    "pdf-to-image": (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    "compress-image": (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    text: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  if (tool.comingSoon) {
    return (
      <Link
        href={tool.route}
        className="card p-4 opacity-50 pointer-events-none"
        aria-disabled="true"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-bg-tertiary rounded-lg text-text-muted">{icons[tool.icon]}</div>
          <div>
            <h3 className="font-medium text-text">{tool.name}</h3>
            <Badge variant="neutral" className="text-xs mt-1">Coming Soon</Badge>
          </div>
        </div>
        <p className="text-sm text-text-muted">{tool.description}</p>
      </Link>
    );
  }

  return (
    <Link
      href={tool.route}
      className="card-hover card p-4 group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-accent-light rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
          {icons[tool.icon]}
        </div>
        <div>
          <h3 className="font-medium text-text">{tool.name}</h3>
          {tool.popular && <Badge variant="primary" className="text-xs mt-1">Popular</Badge>}
        </div>
      </div>
      <p className="text-sm text-text-muted">{tool.description}</p>
    </Link>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = allTools.filter((tool) => {
    if (tool.comingSoon) return false;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-bg-secondary border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              Work smarter with your documents.
            </h1>
            <p className="text-lg lg:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
              Free online tools to compress, convert, merge, split, edit and create documents in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tools">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore All Tools
                </Button>
              </Link>
              <Link href="/tools/compress-pdf">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Compress a PDF
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        <AdSlot slot="homepage-top" />
      </div>

      {/* Popular Tools */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-text">Popular Tools</h2>
              <p className="text-text-muted mt-1">Most used tools by our users</p>
            </div>
            <Link href="/tools" className="text-accent hover:text-accent-hover font-medium text-sm">
              View all tools →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Tool Search */}
      <section className="py-16 lg:py-24 bg-bg-secondary border-y border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-text text-center mb-2">Find a Tool</h2>
            <p className="text-text-muted text-center mb-8">Search by name, keyword, or category</p>
            
            <div className="relative max-w-xl mx-auto mb-8">
              <Input
                placeholder="Search a tool... (e.g., compress PDF, merge PDF, convert JPG)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["compress PDF", "merge PDF", "convert JPG", "resume", "invoice"].map((example) => (
                <span
                  key={example}
                  className="px-3 py-1 text-sm bg-bg rounded border border-border text-text-muted hover:text-text hover:border-border-strong cursor-pointer transition-colors"
                  onClick={() => setSearchQuery(example)}
                >
                  {example}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                    selectedCategory === cat.id
                      ? "border-accent bg-accent-light text-accent"
                      : "border-border hover:border-border-strong text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {searchQuery || selectedCategory ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-muted">No tools found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-text mb-6">Browse by Category</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const catTools = getToolsByCategory(cat.id as Tool["category"]).filter((t) => !t.comingSoon);
                  return (
                    <Card className="p-6 card-hover" key={cat.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{cat.icon}</span>
                        <div>
                          <h4 className="font-semibold text-text">{cat.name}</h4>
                          <p className="text-sm text-text-muted">{catTools.length} tools</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {catTools.slice(0, 5).map((tool) => (
                          <Link
                            key={tool.id}
                            href={tool.route}
                            className="flex items-center gap-3 p-2 rounded hover:bg-bg-tertiary transition-colors group"
                          >
                            <div className="p-1.5 bg-bg-tertiary rounded text-text-muted group-hover:bg-accent-light group-hover:text-accent transition-colors">
                              {icons[tool.icon]}
                            </div>
                            <span className="text-sm text-text-secondary group-hover:text-text">{tool.name}</span>
                          </Link>
                        ))}
                        {catTools.length > 5 && (
                          <Link
                            href={`/tools?category=${cat.id}`}
                            className="text-sm text-accent hover:text-accent-hover font-medium flex items-center justify-center gap-1 py-2"
                          >
                            View all {catTools.length} tools →
                          </Link>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-text mb-2">100%</div>
              <p className="text-text-muted">Free to use</p>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-text mb-2">No</div>
              <p className="text-text-muted">Registration required</p>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-text mb-2">Secure</div>
              <p className="text-text-muted">Files auto-deleted</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const icons: Record<string, React.ReactNode> = {
  merge: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  split: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  rotate: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  extract: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  ),
  remove: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  compress: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  "image-to-pdf": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  "pdf-to-image": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  "compress-image": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  text: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};