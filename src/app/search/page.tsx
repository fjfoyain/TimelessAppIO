"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import {
  EVENT_TYPES,
  PROVIDER_CATEGORIES,
  EVENT_TYPE_ICONS,
  PROVIDER_CATEGORY_ICONS,
} from "@/lib/constants";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function runSearch() {
    const q = query.trim();
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : "/marketplace");
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
                What are you planning?
              </span>
            </h1>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Browse by the type of event you&apos;re hosting, or jump straight to a
              kind of provider.
            </p>
          </div>

          {/* Search box */}
          <div className="relative max-w-xl mx-auto mb-12">
            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              placeholder="Search talent by name, skill or keyword..."
              className="w-full rounded-xl bg-surface-input border border-white/10 pl-12 pr-24 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              onClick={runSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
            >
              Search
            </button>
          </div>

          {/* Browse by event type */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-white mb-4">Browse by event type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {EVENT_TYPES.map((type) => (
                <Link
                  key={type}
                  href={`/marketplace?eventType=${encodeURIComponent(type)}`}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 hover:border-primary/30 hover:bg-white/[0.03] transition group text-center"
                >
                  <span className="material-icons text-3xl text-primary group-hover:scale-110 transition-transform">
                    {EVENT_TYPE_ICONS[type] || "celebration"}
                  </span>
                  <span className="text-sm font-medium text-white">{type}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Browse by provider */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Browse by provider</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROVIDER_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/marketplace?category=${encodeURIComponent(cat)}`}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 hover:border-primary/30 hover:bg-white/[0.03] transition group text-center"
                >
                  <span className="material-icons text-3xl text-accent-cyan group-hover:scale-110 transition-transform">
                    {PROVIDER_CATEGORY_ICONS[cat] || "work"}
                  </span>
                  <span className="text-sm font-medium text-white">{cat}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              href="/marketplace"
              className="px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
            >
              All talent
            </Link>
            <Link
              href="/venues"
              className="px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
            >
              All venues
            </Link>
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
            >
              All events
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
