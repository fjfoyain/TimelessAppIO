"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import Footer from "@/components/landing/Footer";
import TalentCard from "@/components/marketplace/TalentCard";
import { mockTalents, talentCategories, talentCities } from "@/data/mockTalents";

function checkPriceRange(rate: number | undefined, range: string): boolean {
  if (!rate) return false;
  switch (range) {
    case "under100": return rate < 100;
    case "100-200": return rate >= 100 && rate <= 200;
    case "200-300": return rate >= 200 && rate <= 300;
    case "300+": return rate >= 300;
    default: return true;
  }
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredTalents = useMemo(() => {
    return mockTalents.filter(({ talent, user }) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(q) ||
        talent.category.toLowerCase().includes(q) ||
        talent.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        talent.bio.toLowerCase().includes(q);

      const matchesCategory = !selectedCategory || talent.category === selectedCategory;
      const matchesCity = !selectedCity || talent.city === selectedCity;
      const matchesVerified = !verifiedOnly || talent.isVerified;
      const matchesPrice = !priceRange || checkPriceRange(talent.hourlyRate, priceRange);

      return matchesSearch && matchesCategory && matchesCity && matchesVerified && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedCity, priceRange, verifiedOnly]);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
              Discover Talent
            </span>
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            Find the perfect professional for your next event, session, or project.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 py-4 bg-background-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name, skill, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {talentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* City */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none cursor-pointer"
            >
              <option value="">All Cities</option>
              {talentCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none cursor-pointer"
            >
              <option value="">Any Price</option>
              <option value="under100">Under $100/hr</option>
              <option value="100-200">$100 - $200/hr</option>
              <option value="200-300">$200 - $300/hr</option>
              <option value="300+">$300+/hr</option>
            </select>

            {/* Verified Toggle */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                verifiedOnly
                  ? "bg-primary/20 border-primary/50 text-primary-light"
                  : "bg-surface-input border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span className="material-icons text-sm">verified</span>
              Verified
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="relative z-10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <p className="text-sm text-slate-500 mb-6">
            {filteredTalents.length} {filteredTalents.length === 1 ? "talent" : "talents"} found
          </p>

          {filteredTalents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalents.map(({ talent, user }) => (
                <TalentCard key={talent.id} talent={talent} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="material-icons text-5xl text-slate-700 mb-4">search_off</span>
              <h3 className="text-xl font-semibold text-white mb-2">No talent found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSelectedCity("");
                  setPriceRange("");
                  setVerifiedOnly(false);
                }}
                className="px-6 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary-light text-sm font-medium hover:bg-primary/20 transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
