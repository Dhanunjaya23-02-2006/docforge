import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { AdSlot } from "@/components/tools/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | DocForge Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    }
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function renderContentWithAds(htmlContent: string) {
  // Split the content by <h2> tags. Lookahead ensures <h2> remains in the string part.
  const parts = htmlContent.split(/(?=<h2)/i);

  return (
    <>
      {parts.map((part, index) => {
        // We want to insert an ad between content sections.
        // E.g., before the first <h2> (index 1), and optionally before later <h2>s (e.g. index 3).
        // Let's place an ad before the first H2 (if it exists) and before the 3rd H2.
        const shouldShowAd = index === 1 || index === 3;
        
        return (
          <div key={`part-${index}`}>
            {shouldShowAd && (
              <div className="my-8">
                <AdSlot slot={`blog-inline-${index}`} />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: part }} />
          </div>
        );
      })}
    </>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <article className="min-h-screen pb-16">
      <div className="container py-8">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <main className="lg:col-span-8">
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-text-muted text-sm">•</span>
                <span className="text-text-muted text-sm">{post.readingTime}</span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold text-text mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary border-b border-border pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                <span className="text-text-muted hidden sm:inline">•</span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </time>
              </div>
            </header>

            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-text-secondary">
              {renderContentWithAds(post.content)}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold text-text mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-sm border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <AdSlot slot="blog-bottom" className="mt-12" />
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <AdSlot slot="blog-sidebar-top" />
              
              <div className="card p-6 mt-8">
                <h3 className="text-lg font-bold text-text mb-4">Try Our PDF Tools</h3>
                <p className="text-text-muted text-sm mb-4">
                  DocForge offers free, browser-based document tools that are secure and fast.
                </p>
                <div className="space-y-3">
                  <Link href="/tools/compress-pdf" className="block text-accent hover:underline text-sm font-medium">
                    → Compress a PDF
                  </Link>
                  <Link href="/tools/merge-pdf" className="block text-accent hover:underline text-sm font-medium">
                    → Merge PDFs
                  </Link>
                  <Link href="/tools/pdf-to-jpg" className="block text-accent hover:underline text-sm font-medium">
                    → PDF to JPG Converter
                  </Link>
                </div>
              </div>

              <AdSlot slot="blog-sidebar-bottom" className="mt-8" />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
