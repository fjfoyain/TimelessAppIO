"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { getEvents } from "@/lib/firestore";
import type { Event as AppEvent } from "@/types";

function formatDate(date: string): string {
  if (!date) return "Date TBA";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    // Only show events that are open to the public.
    const published = events.filter(
      (e) => !e.status || e.status === "published"
    );
    const q = query.toLowerCase();
    if (!q) return published;
    return published.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
    );
  }, [events, query]);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
                Discover Events
              </span>
            </h1>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Explore upcoming events across the Timeless network.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-10">
            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events by name or location..."
              className="w-full rounded-xl bg-surface-input border border-white/10 pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
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
                event_busy
              </span>
              <p className="text-slate-500">
                {events.length === 0
                  ? "No events have been published yet."
                  : "No events match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  {event.image ? (
                    <div className="h-44 relative">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-primary/30 via-purple-900/20 to-background-dark flex items-center justify-center">
                      <span className="material-icons text-5xl text-white/20">
                        celebration
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-white font-bold truncate">{event.title}</h3>
                    <div className="mt-2 space-y-1.5 text-sm">
                      <p className="text-slate-400 flex items-center gap-1.5">
                        <span className="material-icons text-sm text-primary">
                          calendar_today
                        </span>
                        {formatDate(event.date)}
                        {event.time ? ` · ${event.time}` : ""}
                      </p>
                      {event.location && (
                        <p className="text-slate-400 flex items-center gap-1.5">
                          <span className="material-icons text-sm text-primary">
                            place
                          </span>
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                      {event.organizer && (
                        <p className="text-slate-500 flex items-center gap-1.5">
                          <span className="material-icons text-sm">person</span>
                          {event.organizer}
                        </p>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
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
