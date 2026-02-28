"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useFirestore";
import type { Event as AppEvent } from "@/types";

const statusStyles: Record<string, string> = {
  published: "text-green-400 bg-green-400/10",
  draft: "text-slate-400 bg-slate-400/10",
  cancelled: "text-red-400 bg-red-400/10",
  completed: "text-blue-400 bg-blue-400/10",
  Confirmed: "text-green-400 bg-green-400/10",
  Pending: "text-yellow-400 bg-yellow-400/10",
  Draft: "text-slate-400 bg-slate-400/10",
};

function EventsTable({ events, title }: { events: AppEvent[]; title: string }) {
  return (
    <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-xs text-slate-500 font-medium">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center">
          <span className="material-icons text-3xl text-slate-700 mb-2 block">event_busy</span>
          <p className="text-sm text-slate-500">No events to show</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Event</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Venue</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-white">{event.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="material-icons text-sm text-slate-600">calendar_today</span>
                        {event.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="material-icons text-sm text-slate-600">location_on</span>
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[event.status || "draft"] || "text-slate-400 bg-slate-400/10"}`}>
                        {event.status || "draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg hover:bg-white/5 transition" title="View Details">
                          <span className="material-icons text-sm text-slate-400 hover:text-white">visibility</span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/5 transition" title="Edit Event">
                          <span className="material-icons text-sm text-slate-400 hover:text-white">edit</span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/5 transition" title="More Options">
                          <span className="material-icons text-sm text-slate-400 hover:text-white">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-white/5">
            {events.map((event) => (
              <div key={event.id} className="p-4 hover:bg-white/[0.02] transition">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{event.title}</p>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[event.status || "draft"] || "text-slate-400 bg-slate-400/10"}`}>
                    {event.status || "draft"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-xs">calendar_today</span>
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-xs">location_on</span>
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventsContent() {
  const { user } = useAuth();
  const { events, loading } = useEvents(user?.id);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);
  const completedCount = events.filter((e) => e.status === "completed").length;

  const stats = [
    { label: "Upcoming Events", value: loading ? "..." : String(upcomingEvents.length), icon: "event", change: "" },
    { label: "Completed", value: loading ? "..." : String(completedCount), icon: "check_circle", change: "" },
    { label: "Total Events", value: loading ? "..." : String(events.length), icon: "payments", change: "" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 pt-24 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <span className="material-icons text-4xl text-primary animate-spin mb-3 block">hourglass_empty</span>
                <p className="text-sm text-slate-500">Loading events...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Events &amp; Gigs</h1>
              <p className="text-slate-500 mt-1">
                Track your upcoming performances, manage gigs, and view past events.
              </p>
            </div>
            <Link
              href="/events/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow"
            >
              <span className="material-icons text-sm">add</span>
              Create Event
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-lg text-primary-light">{stat.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                {stat.change && <p className="text-xs text-green-400 mt-1">{stat.change}</p>}
              </div>
            ))}
          </div>

          {/* Events Tables */}
          {events.length === 0 ? (
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
              <span className="material-icons text-5xl text-slate-700 mb-3 block">event_busy</span>
              <h3 className="text-lg font-semibold text-white mb-2">No events yet</h3>
              <p className="text-sm text-slate-500 mb-6">Create your first event to get started.</p>
              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow"
              >
                <span className="material-icons text-sm">add</span>
                Create Event
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <EventsTable events={upcomingEvents} title="Upcoming Events" />
              <EventsTable events={pastEvents} title="Past Events" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function EventsDashboardPage() {
  return (
    <ProtectedRoute>
      <EventsContent />
    </ProtectedRoute>
  );
}
