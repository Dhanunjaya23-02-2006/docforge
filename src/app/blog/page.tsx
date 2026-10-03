import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | DocForge",
  description: "Read the latest tutorials, news, and tips about working with PDFs and documents.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="container pt-12 pb-16 lg:pt-16 lg:pb-20">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-text mb-4">DocForge Blog</h1>
        <p className="text-xl text-text-muted">
          Expert tips, guides, and news about document management and processing.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card p-6 card-hover flex flex-col h-full group"
          >
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2 py-1 rounded">
                {post.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-text mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="text-text-muted text-sm mb-4 flex-1 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center justify-between text-xs text-text-secondary mt-auto pt-4 border-t border-border">
              <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>{post.readingTime}</span>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border rounded-lg">
            No blog posts found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
