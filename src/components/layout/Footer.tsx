"use client";

import Link from "next/link";

const footerLinks = {
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
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary" role="contentinfo" style={{ marginTop: '4rem' }}>
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-text" aria-label="DocForge Home">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <path d="M8 10h16M8 16h12M8 22h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>DocForge</span>
            </Link>
            <p className="mt-4 text-sm text-text-muted max-w-xs">
              Everything you need to work with documents. Free online PDF, document and image tools — fast, simple and secure.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-text transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-text transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-text transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-text transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} DocForge. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-text-muted hover:text-text transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-text-muted hover:text-text transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-text-muted hover:text-text transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}