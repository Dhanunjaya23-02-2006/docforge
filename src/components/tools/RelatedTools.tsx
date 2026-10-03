"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RelatedTool } from "@/types";

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
}

export function RelatedTools({ tools, title = "Related Tools" }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-12 mb-8" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-xl font-semibold text-text mb-6">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.route}
            className="card-hover card p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-light rounded-lg text-accent" aria-hidden="true">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-text">{tool.name}</h3>
                <p className="text-sm text-text-muted">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}