import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://docforge.com'),
  title: "DocForge - Free Online PDF, Document & Image Tools",
  description: "Everything you need to work with documents. Free online tools to compress, convert, merge, split, edit and create documents in seconds.",
  openGraph: {
    title: "DocForge - Free Online PDF, Document & Image Tools",
    description: "Everything you need to work with documents. Free online tools to compress, convert, merge, split, edit and create documents in seconds.",
    url: '/',
    siteName: 'DocForge',
    type: "website",
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Google AdSense Integration Structure - Ready for review */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {/* Google Analytics Integration Structure */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_GA_ID');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}