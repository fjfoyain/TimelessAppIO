"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { getEventById } from "@/lib/firestore";
import type { Event as AppEvent } from "@/types";

function formatDate(date: string): string {
  if (!date) return "Date TBA";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getEventById(id)
      .then((data) => setEvent(data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-4xl text-primary animate-spin">refresh</span>
            </div>
          ) : !event ? (
            <div className="py-20 text-center">
              <span className="material-icons text-5xl text-slate-700 mb-3 block">event_busy</span>
              <h1 className="text-xl font-bold text-white">Event not found</h1>
              <p className="text-sm text-slate-500 mt-2">
                This event may have been removed or is no longer available.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
              >
                Back to events
              </Link>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/events" className="hover:text-primary transition-colors">
                  Events
                </Link>
                <span className="material-icons text-xs">chevron_right</span>
                <span className="text-white truncate">{event.title}</span>
              </nav>

              {/* Hero image */}
              {event.image ? (
                <div className="h-64 sm:h-80 relative rounded-2xl overflow-hidden border border-white/5">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-primary/30 via-purple-900/20 to-background-dark flex items-center justify-center border border-white/5">
                  <span className="material-icons text-6xl text-white/20">celebration</span>
                </div>
              )}

              {/* Title + meta */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-6">
                {event.title}
              </h1>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-icons text-sm text-primary">calendar_today</span>
                    Date
                  </p>
                  <p className="text-sm text-white font-medium mt-1">
                    {formatDate(event.date)}
                    {event.time ? ` · ${event.time}` : ""}
                  </p>
                </div>
                <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-icons text-sm text-primary">place</span>
                    Location
                  </p>
                  <p className="text-sm text-white font-medium mt-1">
                    {event.location || "To be announced"}
                  </p>
                </div>
                <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-icons text-sm text-primary">person</span>
                    Organizer
                  </p>
                  <p className="text-sm text-white font-medium mt-1">
                    {event.organizer || "—"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <section className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-3">About this event</h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </section>
              )}

              {/* Services */}
              {event.services && event.services.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-3">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {event.services.map((s) => (
                      <span
                        key={s}
                        className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Ticket tiers */}
              {event.ticketTiers && event.ticketTiers.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-3">Tickets</h2>
                  <div className="space-y-2">
                    {event.ticketTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between bg-surface-dark/50 border border-white/5 rounded-xl p-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{tier.name}</p>
                          <p className="text-xs text-slate-500">
                            {Math.max(0, tier.totalQuantity - tier.sold)} available
                          </p>
                        </div>
                        <span className="text-lg font-bold text-primary">${tier.price}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-10">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors"
                >
                  <span className="material-icons text-base">arrow_back</span>
                  All events
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
