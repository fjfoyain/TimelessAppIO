"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { getVenueById } from "@/lib/firestore";
import type { Venue } from "@/types";

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getVenueById(id)
      .then((data) => setVenue(data))
      .catch(() => setVenue(null))
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
          ) : !venue ? (
            <div className="py-20 text-center">
              <span className="material-icons text-5xl text-slate-700 mb-3 block">location_off</span>
              <h1 className="text-xl font-bold text-white">Venue not found</h1>
              <p className="text-sm text-slate-500 mt-2">
                This venue may have been removed or is no longer available.
              </p>
              <Link
                href="/venues"
                className="inline-flex items-center gap-1 mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
              >
                Back to venues
              </Link>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/venues" className="hover:text-primary transition-colors">
                  Venues
                </Link>
                <span className="material-icons text-xs">chevron_right</span>
                <span className="text-white truncate">{venue.venueName}</span>
              </nav>

              {/* Header */}
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-icons text-primary text-3xl">location_city</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {venue.venueName}
                    </h1>
                    {venue.address && (
                      <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                        <span className="material-icons text-sm">place</span>
                        {venue.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface-input/40 border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-icons text-sm text-primary">groups</span>
                      Capacity
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {venue.capacity ? `${venue.capacity} people` : "—"}
                    </p>
                  </div>
                  {venue.website && (
                    <div className="bg-surface-input/40 border border-white/5 rounded-xl p-4">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="material-icons text-sm text-primary">language</span>
                        Website
                      </p>
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-light font-medium mt-1 inline-block hover:underline break-all"
                      >
                        {venue.website}
                      </a>
                    </div>
                  )}
                </div>

                {venue.eventTypes && venue.eventTypes.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold text-white mb-2">Event types</h2>
                    <div className="flex flex-wrap gap-2">
                      {venue.eventTypes.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {venue.equipment && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold text-white mb-2">Equipment &amp; amenities</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {venue.equipment}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-white">Planning an event here?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Create your event and select this venue in the wizard.
                </p>
                <Link
                  href="/events/create"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition btn-glow"
                >
                  <span className="material-icons text-sm">add</span>
                  Create an event
                </Link>
              </div>

              <div className="mt-8">
                <Link
                  href="/venues"
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors"
                >
                  <span className="material-icons text-base">arrow_back</span>
                  All venues
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
