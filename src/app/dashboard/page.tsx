"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import Footer from "@/components/landing/Footer";
import { UserRole } from "@/types";

const roleConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  [UserRole.ARTIST]: { label: "Artist", color: "text-primary-light", bg: "bg-primary/10", border: "border-primary/30", icon: "music_note" },
  [UserRole.CLIENT]: { label: "Client", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: "business" },
  [UserRole.TALENT]: { label: "Talent", color: "text-accent-cyan", bg: "bg-accent-cyan/10", border: "border-accent-cyan/30", icon: "star" },
  [UserRole.VENUE]: { label: "Venue", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30", icon: "location_on" },
  [UserRole.PROVIDER]: { label: "Provider", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", icon: "handyman" },
  [UserRole.ADMIN]: { label: "Admin", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "admin_panel_settings" },
};

const roleStats: Record<string, { label: string; value: string; icon: string }[]> = {
  [UserRole.TALENT]: [
    { label: "Profile Views", value: "0", icon: "visibility" },
    { label: "Jobs Completed", value: "0", icon: "check_circle" },
    { label: "Response Rate", value: "—", icon: "speed" },
    { label: "Rating", value: "—", icon: "star" },
  ],
  [UserRole.ARTIST]: [
    { label: "Bookings", value: "0", icon: "event" },
    { label: "Followers", value: "0", icon: "group" },
    { label: "Events", value: "0", icon: "celebration" },
    { label: "Tracks", value: "0", icon: "album" },
  ],
  [UserRole.CLIENT]: [
    { label: "Active Projects", value: "0", icon: "folder" },
    { label: "Hired Talent", value: "0", icon: "person_search" },
    { label: "Budget Spent", value: "$0", icon: "payments" },
    { label: "Events", value: "0", icon: "event" },
  ],
  [UserRole.VENUE]: [
    { label: "Bookings", value: "0", icon: "calendar_month" },
    { label: "Reviews", value: "0", icon: "reviews" },
    { label: "Capacity", value: "—", icon: "groups" },
    { label: "Revenue", value: "$0", icon: "trending_up" },
  ],
};

const roleActions: Record<string, { label: string; description: string; icon: string; href: string }[]> = {
  [UserRole.TALENT]: [
    { label: "Browse Marketplace", description: "Discover talent and opportunities", icon: "storefront", href: "/marketplace" },
    { label: "Edit Profile", description: "Update your portfolio and rates", icon: "edit", href: "/settings" },
    { label: "Messages", description: "Check conversations", icon: "chat", href: "/messages" },
  ],
  [UserRole.ARTIST]: [
    { label: "Browse Marketplace", description: "Find studios and collaborators", icon: "storefront", href: "/marketplace" },
    { label: "Edit Profile", description: "Update your music and bio", icon: "edit", href: "/settings" },
    { label: "Find Studios", description: "Book recording sessions", icon: "mic", href: "/studio" },
  ],
  [UserRole.CLIENT]: [
    { label: "Browse Talent", description: "Find the perfect professional", icon: "storefront", href: "/marketplace" },
    { label: "Create Event", description: "Start planning your event", icon: "add_circle", href: "/events/create" },
    { label: "Messages", description: "Check conversations", icon: "chat", href: "/messages" },
  ],
  [UserRole.VENUE]: [
    { label: "Browse Marketplace", description: "Find talent for your venue", icon: "storefront", href: "/marketplace" },
    { label: "Edit Venue", description: "Update venue details", icon: "edit", href: "/settings" },
    { label: "Manage Bookings", description: "View upcoming events", icon: "calendar_month", href: "/booking" },
  ],
};

function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  const role = roleConfig[user.role] || roleConfig[UserRole.TALENT];
  const stats = roleStats[user.role] || roleStats[UserRole.TALENT];
  const actions = roleActions[user.role] || roleActions[UserRole.TALENT];

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${role.bg} ${role.color} border ${role.border}`}>
                <span className="material-icons text-sm">{role.icon}</span>
                {role.label}
              </span>
            </div>
            <p className="text-slate-500">
              Here&apos;s your overview. Start exploring or manage your profile.
            </p>
          </div>

          {/* Dashboard Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { label: "Overview", href: "/dashboard", icon: "dashboard" },
              { label: "Events", href: "/dashboard/events", icon: "event" },
              { label: "Projects", href: "/dashboard/projects", icon: "folder" },
              ...(user.role === UserRole.VENUE ? [{ label: "Venue", href: "/dashboard/venue", icon: "location_on" }] : []),
              ...(user.role === UserRole.ADMIN ? [{ label: "Admin", href: "/admin", icon: "admin_panel_settings" }] : []),
            ].map((nav) => (
              <Link
                key={nav.label}
                href={nav.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  nav.href === "/dashboard"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                }`}
              >
                <span className="material-icons text-sm">{nav.icon}</span>
                {nav.label}
              </Link>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${role.bg} flex items-center justify-center`}>
                    <span className={`material-icons text-lg ${role.color}`}>{stat.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${role.bg} flex items-center justify-center mb-4`}>
                  <span className={`material-icons text-xl ${role.color}`}>{action.icon}</span>
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-primary-light transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-slate-500">{action.description}</p>
                <div className="flex items-center gap-1 mt-4 text-xs text-slate-600 group-hover:text-primary transition-colors">
                  <span>Go</span>
                  <span className="material-icons text-xs">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Account Status */}
          <div className="mt-10 bg-surface-dark/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-white">Account Status: {user.status}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your profile is being reviewed. You&apos;ll get full access once approved.</p>
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
