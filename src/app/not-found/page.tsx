"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/tools/EmptyState";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 px-4">
      <div className="text-center max-w-md">
        <EmptyState
          icon={
            <svg className="h-20 w-20 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          title="Page Not Found"
          description="Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist."
          action={{ label: "Go Home", onClick: () => window.location.href = "/" }}
          secondaryAction={{ label: "Browse Tools", onClick: () => window.location.href = "/tools" }}
        />
      </div>
    </div>
  );
}