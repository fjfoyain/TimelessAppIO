import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog — Timeless",
  description:
    "Guides and tips on hiring talent, planning events and choosing venues — from the Timeless team.",
  openGraph: {
    title: "Timeless Blog",
    description:
      "Guides and tips on hiring talent, planning events and choosing venues.",
    type: "website",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
                Timeless Blog
              </span>
            </h1>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Guides and tips on hiring talent, planning events and choosing venues.
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-colors group"
              >
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-light font-medium">
                    {post.category}
                  </span>
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium">
                  Read article
                  <span className="material-icons text-sm">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
