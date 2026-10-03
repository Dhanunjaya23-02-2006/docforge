"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const navigation = {
  main: [
    { name: "Tools", href: "/tools" },
    { name: "PDF Tools", href: "/tools?category=pdf" },
    { name: "Image Tools", href: "/tools?category=images" },
    { name: "Generators", href: "/tools?category=generators" },
    { name: "Templates", href: "/tools?category=templates" },
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricing" },
  ],
  footer: {
    product: [
      { name: "All Tools", href: "/tools" },
      { name: "PDF Tools", href: "/tools?category=pdf" },
      { name: "Image Tools", href: "/tools?category=images" },
      { name: "Document Generators", href: "/tools?category=generators" },
      { name: "Templates", href: "/tools?category=templates" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Guides", href: "/guides" },
      { name: "FAQ", href: "/faq" },
      { name: "Help Center", href: "/help" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
    legal: [
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "DMCA / Copyright", href: "/dmca" },
    ],
  },
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-text" aria-label="DocForge Home">
            <svg className="h-6 w-6 text-accent" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="currentColor"/>
              <path d="M8 10h16M8 16h12M8 22h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span>DocForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden btn btn-ghost btn-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-base font-medium text-text-secondary hover:text-text hover:bg-bg-tertiary rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/login" className="btn btn-ghost w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}