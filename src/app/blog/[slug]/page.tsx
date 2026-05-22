import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { blogPosts, getBlogPost } from "@/data/blogPosts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) {
    return { title: "Article not found — Timeless" };
  }
  return {
    title: `${post.title} — Timeless Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="text-white truncate">{post.title}</span>
          </nav>

          {/* Header */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-light font-medium">
              {post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-lg text-slate-400 leading-relaxed">
            {post.excerpt}
          </p>
          <p className="mt-4 text-sm text-slate-500">By {post.author}</p>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Body */}
          <div className="space-y-6">
            {post.sections.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="text-xl font-bold text-white mb-3">
                    {section.heading}
                  </h2>
                )}
                {section.body.map((para, j) => (
                  <p
                    key={j}
                    className="text-slate-300 leading-relaxed mb-3 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-white">
              Ready to plan your next event?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Discover artists, venues and services on Timeless.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition btn-glow"
            >
              <span className="material-icons text-sm">storefront</span>
              Browse the marketplace
            </Link>
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors"
            >
              <span className="material-icons text-base">arrow_back</span>
              All articles
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
