"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { getVenues } from "@/lib/firestore";
import type { Venue } from "@/types";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    getVenues()
      .then((data) => setVenues(data))
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, []);

  const eventTypes = useMemo(
    () =>
      Array.from(
        new Set(venues.flatMap((v) => v.eventTypes ?? []).filter(Boolean))
      ),
    [venues]
  );

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        v.venueName?.toLowerCase().includes(q) ||
        v.address?.toLowerCase().includes(q);
      const matchesType =
        !eventType || (v.eventTypes ?? []).includes(eventType);
      return matchesQuery && matchesType;
    });
  }, [venues, query, eventType]);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Browse Venues
            </h1>
            <p className="text-slate-500 mt-1">
              Discover spaces for your next event — clubs, halls, rooftops and more.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by venue name or location..."
                className="w-full rounded-xl bg-surface-input border border-white/10 pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">All event types</option>
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-4xl text-primary animate-spin">
                refresh
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="material-icons text-4xl text-slate-700 mb-2 block">
                location_off
              </span>
              <p className="text-slate-500">
                {venues.length === 0
                  ? "No venues are listed yet."
                  : "No venues match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((v) => (
                <Link
                  key={v.id}
                  href={`/venues/${v.id}`}
                  className="block bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-icons text-primary">
                        location_city
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {v.venueName}
                      </h3>
                      {v.address && (
                        <p className="text-slate-500 text-xs truncate flex items-center gap-1">
                          <span className="material-icons text-xs">place</span>
                          {v.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                    <span className="material-icons text-sm">groups</span>
                    Capacity: {v.capacity || "—"}
                  </div>

                  {v.eventTypes && v.eventTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {v.eventTypes.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
