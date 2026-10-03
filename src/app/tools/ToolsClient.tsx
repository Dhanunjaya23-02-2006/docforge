"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { getToolsByCategory, getPopularTools } from "@/lib/tools";
import { Tool, ToolCategory } from "@/types";

function ToolsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(
    (searchParams.get("category") as ToolCategory) || null
  );
  const [sortBy, setSortBy] = useState<"popular" | "alphabetical">(
    (searchParams.get("sort") as "popular" | "alphabetical") || "popular"
  );

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory((searchParams.get("category") as ToolCategory) || null);
    setSortBy((searchParams.get("sort") as "popular" | "alphabetical") || "popular");
  }, [searchParams]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`/tools?${params.toString()}`);
  };

  const allTools = [
    ...getToolsByCategory("pdf"),
    ...getToolsByCategory("images"),
    ...getToolsByCategory("documents"),
    ...getToolsByCategory("ocr"),
    ...getToolsByCategory("generators"),
    ...getToolsByCategory("templates"),
  ];

  const filteredTools = useMemo(() => {
    let tools = allTools.filter((tool) => !tool.comingSoon);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      tools = tools.filter((tool) => tool.category === selectedCategory);
    }
    
    if (sortBy === "alphabetical") {
      tools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      tools = [...tools].sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      });
    }
    
    return tools;
  }, [searchQuery, selectedCategory, sortBy]);

  const categories: { id: ToolCategory; name: string; description: string }[] = [
    { id: "pdf", name: "PDF Tools", description: "Merge, split, rotate, compress, extract, and edit PDF files" },
    { id: "images", name: "Image Tools", description: "Convert, compress, and transform images" },
    { id: "documents", name: "Document Tools", description: "Convert between document formats" },
    { id: "ocr", name: "OCR", description: "Extract text from scanned documents" },
    { id: "generators", name: "Generators", description: "Create documents from templates" },
    { id: "templates", name: "Templates", description: "Ready-to-use document templates" },
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
          <div className="flex items-start gap-3">
            <div className="p-2 bg-bg-tertiary rounded-lg text-text-muted flex-shrink-0">{icons[tool.icon]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text">{tool.name}</h3>
                <Badge variant="neutral" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-text-muted mt-1">{tool.description}</p>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link
        href={tool.route}
        className="card-hover card p-4 group"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-accent-light rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
            {icons[tool.icon]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-text">{tool.name}</h3>
              {tool.popular && <Badge variant="primary" className="text-xs">Popular</Badge>}
            </div>
            <p className="text-sm text-text-muted mt-1 line-clamp-2">{tool.description}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-6">
        <div className="card p-4 sticky top-24">
          <h2 className="font-semibold text-text mb-3">Search Tools</h2>
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="card p-4 sticky top-24" style={{ top: "calc(24px + 160px)" }}>
          <h2 className="font-semibold text-text mb-3">Categories</h2>
          <div className="space-y-1">
            <button
              onClick={() => updateUrl({ category: null })}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                !selectedCategory
                  ? "bg-accent-light text-accent"
                  : "text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              All Tools
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateUrl({ category: cat.id })}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-accent-light text-accent"
                    : "text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4 sticky top-24" style={{ top: "calc(24px + 380px)" }}>
          <h2 className="font-semibold text-text mb-3">Sort By</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value="popular"
                checked={sortBy === "popular"}
                onChange={() => updateUrl({ sort: "popular" })}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">Popular first</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value="alphabetical"
                checked={sortBy === "alphabetical"}
                onChange={() => updateUrl({ sort: "alphabetical" })}
                className="h-4 w-4 text-accent border-border-strong focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">Alphabetical</span>
            </label>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-8">
        {selectedCategory && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent-light rounded-lg text-accent">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">{categories.find((c) => c.id === selectedCategory)?.name}</h2>
                <p className="text-sm text-text-muted">{categories.find((c) => c.id === selectedCategory)?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="neutral">{filteredTools.length} tools</Badge>
            </div>
          </div>
        )}

        {searchQuery && !selectedCategory && (
          <div className="card p-4">
            <p className="text-sm text-text-muted">
              Showing <strong>{filteredTools.length}</strong> results for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {!searchQuery && !selectedCategory && (
          <>
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text">Popular Tools</h2>
                <Link href="/tools?sort=popular" className="text-sm text-accent hover:text-accent-hover">View all</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getPopularTools().map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>

            {categories.map((cat) => {
              const catTools = getToolsByCategory(cat.id).filter((t) => !t.comingSoon);
              return (
                <section key={cat.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text">{cat.name}</h2>
                    <Link href={`/tools?category=${cat.id}`} className="text-sm text-accent hover:text-accent-hover">View all</Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {catTools.slice(0, 6).map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}

        {filteredTools.length > 0 && (searchQuery || selectedCategory) && (
          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {filteredTools.length === 0 && (searchQuery || selectedCategory) && (
          <div className="card p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-text">No tools found</h3>
            <p className="mt-2 text-text-muted">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="flex-1">
      <div className="container pt-8 pb-16 lg:pt-12 lg:pb-20">
        <header className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-text mb-2">All Tools</h1>
          <p className="text-lg text-text-muted">Free online tools to work with your documents</p>
        </header>

        <Suspense fallback={<div className="text-center py-12">Loading tools...</div>}>
          <ToolsContent />
        </Suspense>
      </div>
    </div>
  );
}