"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const stats = [
  { label: "Total Bookings", value: "156", icon: "calendar_month", color: "text-primary-light", bg: "bg-primary/10" },
  { label: "This Month", value: "12", icon: "date_range", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { label: "Revenue", value: "$45,200", icon: "trending_up", color: "text-green-400", bg: "bg-green-400/10" },
  { label: "Occupancy", value: "78%", icon: "groups", color: "text-amber-400", bg: "bg-amber-400/10" },
];

interface Booking {
  id: string;
  artist: string;
  date: string;
  type: string;
  status: "Confirmed" | "Pending" | "Tentative";
  time: string;
}

const upcomingBookings: Booking[] = [
  { id: "1", artist: "DJ Neon Pulse", date: "Mar 8, 2026", time: "9:00 PM", type: "Live DJ Set", status: "Confirmed" },
  { id: "2", artist: "The Velvet Strings", date: "Mar 12, 2026", time: "7:30 PM", type: "Acoustic Night", status: "Confirmed" },
  { id: "3", artist: "Luna Ray", date: "Mar 18, 2026", time: "8:00 PM", type: "Album Launch", status: "Pending" },
  { id: "4", artist: "Echo Chamber Collective", date: "Mar 25, 2026", time: "10:00 PM", type: "Electronic Showcase", status: "Tentative" },
  { id: "5", artist: "Marcus & The Groove", date: "Apr 2, 2026", time: "9:00 PM", type: "Jazz Night", status: "Confirmed" },
];

const statusStyles: Record<string, string> = {
  Confirmed: "text-green-400 bg-green-400/10",
  Pending: "text-yellow-400 bg-yellow-400/10",
  Tentative: "text-slate-400 bg-slate-400/10",
};

const quickActions = [
  { label: "Add Availability", description: "Set open dates and time slots", icon: "event_available", href: "#" },
  { label: "View Calendar", description: "See your full booking calendar", icon: "calendar_month", href: "/booking" },
  { label: "Edit Venue Profile", description: "Update photos, capacity, and amenities", icon: "edit", href: "#" },
];

function VenueContent() {
  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Venue Dashboard</h1>
              <p className="text-slate-500 mt-1">
                Manage bookings, track revenue, and keep your venue running smoothly.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition">
                <span className="material-icons text-sm">download</span>
                Export Report
              </button>
              <Link
                href="/booking"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow"
              >
                <span className="material-icons text-sm">add</span>
                New Booking
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <span className={`material-icons text-lg ${stat.color}`}>{stat.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Bookings - takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">Upcoming Bookings</h3>
                  <Link
                    href="/booking"
                    className="text-primary text-sm font-medium hover:text-primary-light transition"
                  >
                    View Calendar
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary text-sm">mic_external_on</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{booking.artist}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{booking.date}</span>
                            <span className="text-xs text-slate-600">&middot;</span>
                            <span className="text-xs text-slate-500">{booking.time}</span>
                            <span className="text-xs text-slate-600">&middot;</span>
                            <span className="text-xs text-slate-400">{booking.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                          {booking.status}
                        </span>
                        <button className="p-2 rounded-lg hover:bg-white/5 transition">
                          <span className="material-icons text-sm text-slate-400 hover:text-white">more_vert</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-icons text-primary text-lg">{action.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-primary-light transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-slate-500">{action.description}</p>
                      </div>
                      <span className="material-icons text-sm text-slate-600 ml-auto group-hover:text-primary transition-colors">
                        arrow_forward
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Venue Performance */}
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Venue Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Avg. Rating</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <span className="material-icons text-yellow-400 text-sm">star</span>
                        4.8 / 5.0
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: "96%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Repeat Bookings</span>
                      <span className="text-white font-semibold">64%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-primary" style={{ width: "64%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Response Time</span>
                      <span className="text-white font-semibold text-green-400">~2 hrs</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-green-400" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VenueDashboardPage() {
  return (
    <ProtectedRoute>
      <VenueContent />
    </ProtectedRoute>
  );
}
