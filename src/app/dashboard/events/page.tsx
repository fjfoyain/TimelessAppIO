"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const stats = [
  { label: "Upcoming Events", value: "5", icon: "event", change: "+2 this week" },
  { label: "Completed", value: "23", icon: "check_circle", change: "+3 this month" },
  { label: "Total Earnings", value: "$14,500", icon: "payments", change: "+12% vs last month" },
];

interface EventRow {
  id: string;
  name: string;
  date: string;
  venue: string;
  status: "Confirmed" | "Pending" | "Draft";
  payout: string;
}

const upcomingEvents: EventRow[] = [
  { id: "1", name: "Summer Jazz Festival", date: "Mar 15, 2026", venue: "The Blue Note", status: "Confirmed", payout: "$2,500" },
  { id: "2", name: "Neon Nights — Live Set", date: "Mar 22, 2026", venue: "Skyline Rooftop", status: "Confirmed", payout: "$1,800" },
  { id: "3", name: "Acoustic Brunch Session", date: "Apr 3, 2026", venue: "Maple & Vine", status: "Pending", payout: "$600" },
  { id: "4", name: "Underground Beat Showcase", date: "Apr 10, 2026", venue: "Sub Rosa", status: "Draft", payout: "$1,200" },
  { id: "5", name: "Art Gallery Opening", date: "Apr 18, 2026", venue: "Canvas District", status: "Pending", payout: "$950" },
];

const pastEvents: EventRow[] = [
  { id: "p1", name: "Winter Solstice Concert", date: "Dec 21, 2025", venue: "Grand Hall", status: "Confirmed", payout: "$3,200" },
  { id: "p2", name: "New Year's Eve Bash", date: "Dec 31, 2025", venue: "The Penthouse", status: "Confirmed", payout: "$4,000" },
  { id: "p3", name: "Valentine's Day Set", date: "Feb 14, 2026", venue: "Rose Garden Lounge", status: "Confirmed", payout: "$1,750" },
];

const statusStyles: Record<string, string> = {
  Confirmed: "text-green-400 bg-green-400/10",
  Pending: "text-yellow-400 bg-yellow-400/10",
  Draft: "text-slate-400 bg-slate-400/10",
};

function EventsTable({ events, title }: { events: EventRow[]; title: string }) {
  return (
    <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-xs text-slate-500 font-medium">{events.length} events</span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Event</th>
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Venue</th>
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Payout</th>
              <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/[0.02] transition">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-white">{event.name}</p>
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
                    {event.venue}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[event.status]}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-white">{event.payout}</p>
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
              <p className="text-sm font-semibold text-white">{event.name}</p>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[event.status]}`}>
                {event.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-icons text-xs">calendar_today</span>
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-icons text-xs">location_on</span>
                {event.venue}
              </span>
              <span className="font-semibold text-white">{event.payout}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsContent() {
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
                <p className="text-xs text-green-400 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Events Table */}
          <div className="space-y-8">
            <EventsTable events={upcomingEvents} title="Upcoming Events" />
            <EventsTable events={pastEvents} title="Past Events" />
          </div>
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
