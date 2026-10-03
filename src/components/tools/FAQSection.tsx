"use client";

import { useState } from "react";
import { FAQItem } from "@/types";

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export function FAQSection({ items, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold text-text mb-6">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <details
            key={index}
            className="group card p-4"
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-text">
              {item.question}
              <svg
                className="h-5 w-5 text-text-muted transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 text-text-secondary text-sm animate-in fade-in slide-in-from-top-2 duration-200">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}