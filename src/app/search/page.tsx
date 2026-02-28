"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const browseCategories = [
  { name: "Artists", icon: "music_note", count: "2,400+", color: "from-purple-600 to-violet-600", href: "/marketplace" },
  { name: "Venues", icon: "location_on", count: "850+", color: "from-pink-600 to-rose-600", href: "/marketplace" },
  { name: "Events", icon: "celebration", count: "1,200+", color: "from-cyan-600 to-blue-600", href: "/marketplace" },
  { name: "Studios", icon: "mic", count: "340+", color: "from-amber-600 to-orange-600", href: "/studio" },
  { name: "Services", icon: "handyman", count: "980+", color: "from-green-600 to-emerald-600", href: "/marketplace" },
  { name: "Community", icon: "groups", count: "5,600+", color: "from-fuchsia-600 to-pink-600", href: "/marketplace" },
];

const recentSearches = ["DJ for wedding Miami", "Sound engineer NYC", "Venue 500 capacity"];

const trending = [
  { title: "Latin Music DJs", category: "Artists", searches: "12.4K searches" },
  { title: "Rooftop Venues", category: "Venues", searches: "8.9K searches" },
  { title: "Sound Engineers", category: "Services", searches: "7.2K searches" },
  { title: "Music Production Classes", category: "Studio", searches: "6.1K searches" },
  { title: "Wedding Bands", category: "Artists", searches: "5.8K searches" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Search Input */}
          <div className="mb-12">
            <div className="relative">
              <span className="material-icons absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-2xl">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search artists, venues, events, services..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-surface-dark/50 backdrop-blur-xl border border-white/10 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                >
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Browse by Topic */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Browse by Topic</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {browseCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}
                  >
                    <span className="material-icons text-white text-xl">{cat.icon}</span>
                  </div>
                  <h3 className="text-white font-semibold group-hover:text-primary-light transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Searches */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Searches</h2>
              <button className="text-xs text-slate-500 hover:text-primary-light transition">
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition"
                >
                  <span className="material-icons text-sm text-slate-600">history</span>
                  {search}
                </button>
              ))}
            </div>
          </section>

          {/* Trending */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Trending</h2>
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
              {trending.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => setQuery(item.title)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition text-left"
                >
                  <span className="text-sm font-bold text-slate-600 w-6 text-center">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-icons text-xs text-primary-light">trending_up</span>
                    {item.searches}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
