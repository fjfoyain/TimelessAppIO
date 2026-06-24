"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import WhatsAppFAB from "@/components/landing/WhatsAppFAB";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useFirestore";
import { getVenues } from "@/lib/firestore";
import {
  EVENT_TYPES,
  PROVIDER_CATEGORIES,
  EVENT_TYPE_ICONS,
  PROVIDER_CATEGORY_ICONS,
} from "@/lib/constants";
import { UserRole, type Venue } from "@/types";

/* ─────────── Static data ─────────── */

const roles = [
  {
    label: "Client",
    icon: "diamond",
    tagline: "Hire & organize events",
    href: "/register/client",
    iconColor: "text-amber-400",
    hoverBorder: "hover:border-amber-500/50",
  },
  {
    label: "Talent",
    icon: "stars",
    tagline: "Get booked & grow",
    href: "/register/talent",
    iconColor: "text-accent-cyan",
    hoverBorder: "hover:border-cyan-500/50",
  },
  {
    label: "Venue",
    icon: "stadium",
    tagline: "Fill your calendar",
    href: "/register/venue",
    iconColor: "text-pink-400",
    hoverBorder: "hover:border-pink-500/50",
  },
  {
    label: "Artist",
    icon: "music_note",
    tagline: "Share your sound",
    href: "/register/artist",
    iconColor: "text-primary-light",
    hoverBorder: "hover:border-primary/50",
  },
] as const;

const howItWorks = [
  {
    icon: "search",
    title: "Tell us what you're planning",
    body: "Pick an event type or a kind of provider — weddings, club nights, DJs, photographers and more.",
  },
  {
    icon: "groups",
    title: "Browse vetted providers",
    body: "Compare talent and venues, see plans and reviews, and shortlist who fits your vibe and budget.",
  },
  {
    icon: "verified_user",
    title: "Chat & book securely",
    body: "Negotiate the price, sign the contract and keep everything inside Timeless — no surprises.",
  },
] as const;

type RoleAction = { label: string; description: string; icon: string; href: string };

const roleActions: Record<string, RoleAction[]> = {
  [UserRole.CLIENT]: [
    { label: "Create an Event", description: "Start planning and find providers", icon: "add_circle", href: "/events/create" },
    { label: "Find Talent", description: "Browse DJs, bands, photographers", icon: "storefront", href: "/marketplace" },
    { label: "Messages", description: "Your conversations & contracts", icon: "chat", href: "/messages" },
  ],
  [UserRole.VENUE]: [
    { label: "My Venue", description: "Manage your space & details", icon: "location_on", href: "/dashboard/venue" },
    { label: "Find Talent", description: "Book acts for your venue", icon: "storefront", href: "/marketplace" },
    { label: "Bookings", description: "View your calendar", icon: "calendar_month", href: "/booking" },
  ],
  [UserRole.TALENT]: [
    { label: "My Portfolio", description: "Showcase your best work", icon: "collections", href: "/dashboard/portfolio" },
    { label: "Messages", description: "Respond to client requests", icon: "chat", href: "/messages" },
    { label: "Payout Methods", description: "Set up how you get paid", icon: "account_balance", href: "/dashboard/payouts" },
  ],
  [UserRole.ARTIST]: [
    { label: "Find Studios", description: "Book recording sessions", icon: "mic", href: "/studio" },
    { label: "Browse Marketplace", description: "Collaborators & opportunities", icon: "storefront", href: "/marketplace" },
    { label: "Messages", description: "Your conversations", icon: "chat", href: "/messages" },
  ],
  [UserRole.PROVIDER]: [
    { label: "Add a Service", description: "List what you offer", icon: "add_business", href: "/services/new" },
    { label: "Find Work", description: "Browse the marketplace", icon: "storefront", href: "/marketplace" },
    { label: "Messages", description: "Your conversations", icon: "chat", href: "/messages" },
  ],
  [UserRole.ADMIN]: [
    { label: "Admin Panel", description: "Control center", icon: "admin_panel_settings", href: "/admin" },
    { label: "Approvals", description: "Pending verifications", icon: "task_alt", href: "/admin/approvals" },
    { label: "Dashboard", description: "Your overview", icon: "dashboard", href: "/dashboard" },
  ],
};

const roleChip: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  [UserRole.ARTIST]: { label: "Artist", color: "text-primary-light", bg: "bg-primary/10", border: "border-primary/30", icon: "music_note" },
  [UserRole.CLIENT]: { label: "Client", color: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: "diamond" },
  [UserRole.TALENT]: { label: "Talent", color: "text-accent-cyan", bg: "bg-accent-cyan/10", border: "border-accent-cyan/30", icon: "stars" },
  [UserRole.VENUE]: { label: "Venue", color: "text-pink-300", bg: "bg-pink-500/10", border: "border-pink-500/30", icon: "stadium" },
  [UserRole.PROVIDER]: { label: "Provider", color: "text-green-300", bg: "bg-green-500/10", border: "border-green-500/30", icon: "handyman" },
  [UserRole.ADMIN]: { label: "Admin", color: "text-red-300", bg: "bg-red-500/10", border: "border-red-500/30", icon: "admin_panel_settings" },
};

function formatEventDate(date: string): string {
  if (!date) return "Date TBA";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ─────────── Section: search + browse by interest ─────────── */

function DiscoverySection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function runSearch() {
    const q = query.trim();
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : "/marketplace");
  }

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search */}
      <div className="relative max-w-2xl mx-auto mb-12">
        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
          placeholder="Search talent, venues or a skill…"
          aria-label="Search the marketplace"
          className="w-full rounded-2xl bg-surface-input border border-white/10 pl-12 pr-28 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <button
          onClick={runSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition"
        >
          Search
        </button>
      </div>

      {/* Browse by event type */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">What are you planning?</h2>
            <p className="text-sm text-slate-400 mt-1">Find everything you need by the type of event.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EVENT_TYPES.map((type) => (
            <Link
              key={type}
              href={`/marketplace?eventType=${encodeURIComponent(type)}`}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface-dark/60 backdrop-blur-xl border border-white/5 hover:border-primary/40 hover:-translate-y-0.5 transition-all group text-center"
            >
              <span className="material-icons text-3xl text-primary-light group-hover:scale-110 transition-transform">
                {EVENT_TYPE_ICONS[type] || "celebration"}
              </span>
              <span className="text-sm font-medium text-white">{type}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse by provider */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Find a provider</h2>
            <p className="text-sm text-slate-400 mt-1">Go straight to the kind of professional you need.</p>
          </div>
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-primary-light hover:text-white transition"
          >
            View all
            <span className="material-icons text-base">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PROVIDER_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/marketplace?category=${encodeURIComponent(cat)}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-surface-dark/60 backdrop-blur-xl border border-white/5 hover:border-accent-cyan/40 hover:-translate-y-0.5 transition-all group"
            >
              <span className="material-icons text-2xl text-accent-cyan group-hover:scale-110 transition-transform shrink-0">
                {PROVIDER_CATEGORY_ICONS[cat] || "work"}
              </span>
              <span className="text-sm font-medium text-white">{cat}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Section: explore rails (venues + events) ─────────── */

function ExploreRails() {
  const { events, loading: eventsLoading } = useEvents();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);

  useEffect(() => {
    getVenues()
      .then((data) => setVenues(data))
      .catch(() => setVenues([]))
      .finally(() => setVenuesLoading(false));
  }, []);

  const topVenues = useMemo(() => venues.slice(0, 4), [venues]);
  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => !e.status || e.status === "published")
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .slice(0, 4);
  }, [events]);

  const hasVenues = !venuesLoading && topVenues.length > 0;
  const hasEvents = !eventsLoading && upcomingEvents.length > 0;

  if (!hasVenues && !hasEvents) return null;

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {hasEvents && (
        <div>
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Upcoming events</h2>
            <Link href="/events" className="inline-flex items-center gap-1 text-sm text-primary-light hover:text-white transition">
              See all
              <span className="material-icons text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 transition-all"
              >
                {event.image ? (
                  <div className="h-32 relative">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-primary/30 via-purple-900/20 to-background-dark flex items-center justify-center">
                    <span className="material-icons text-4xl text-white/20">celebration</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm truncate">{event.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                    <span className="material-icons text-sm text-primary-light">calendar_today</span>
                    {formatEventDate(event.date)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasVenues && (
        <div>
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Featured venues</h2>
            <Link href="/venues" className="inline-flex items-center gap-1 text-sm text-primary-light hover:text-white transition">
              See all
              <span className="material-icons text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topVenues.map((v) => (
              <Link
                key={v.id}
                href={`/venues/${v.id}`}
                className="block bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <span className="material-icons text-primary-light">location_city</span>
                </div>
                <h3 className="text-white font-semibold text-sm truncate">{v.venueName}</h3>
                {v.address && (
                  <p className="text-xs text-slate-400 mt-1 truncate flex items-center gap-1">
                    <span className="material-icons text-xs">place</span>
                    {v.address}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <span className="material-icons text-sm">groups</span>
                  Capacity: {v.capacity || "—"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────── Logged-out: hero + join ─────────── */

function LandingHero() {
  return (
    <section className="relative z-10 pt-28 pb-4 lg:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-medium text-primary-light tracking-wide">Now in Beta v2.0</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.95]">
          Everything for your
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent text-glow">
            next event.
          </span>
        </h1>
        <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
          Timeless connects clients, talent, venues and artists in one place. Find the right
          people, agree on a price and book — all securely.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {howItWorks.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl bg-surface-dark/40 backdrop-blur-xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-primary-light">{step.icon}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">STEP {i + 1}</span>
            </div>
            <h3 className="text-white font-semibold mb-1.5">{step.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function JoinBand() {
  return (
    <section className="relative z-10 border-t border-white/5 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Join Timeless</h2>
          <p className="text-slate-400 mt-2">Create an account in the role that fits you.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {roles.map((role) => (
            <Link
              key={role.label}
              href={role.href}
              className={`group relative flex flex-col items-center justify-center gap-3 h-[170px] rounded-2xl border border-white/5 bg-card-dark transition-all duration-300 hover:-translate-y-1 ${role.hoverBorder}`}
            >
              <span className={`material-icons text-4xl ${role.iconColor} opacity-90 group-hover:opacity-100 transition-opacity`}>
                {role.icon}
              </span>
              <span className="text-sm font-semibold text-white tracking-wide">{role.label}</span>
              <span className="text-xs text-slate-400">{role.tagline}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-light font-medium hover:text-white transition">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ─────────── Logged-in: role-aware launchpad ─────────── */

function ReturningHub({ name, role, isSuperUser }: { name: string; role: UserRole; isSuperUser?: boolean }) {
  const chip = roleChip[role] || roleChip[UserRole.CLIENT];
  const actions = roleActions[role] || roleActions[UserRole.CLIENT];
  const firstName = name?.split(" ")[0] || "there";

  return (
    <section className="relative z-10 pt-28 pb-4 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Welcome back, {firstName}
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${chip.bg} ${chip.color} border ${chip.border}`}>
            <span className="material-icons text-sm">{chip.icon}</span>
            {chip.label}
          </span>
          {isSuperUser && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <span className="material-icons text-sm">all_inclusive</span>
              Demo Mode
            </span>
          )}
        </div>
        <p className="text-slate-400 mb-8">Jump back in, or discover something new below.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-icons text-xl text-primary-light">{action.icon}</span>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-primary-light transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-slate-400">{action.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            <span className="material-icons text-base">dashboard</span>
            Go to Dashboard
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            <span className="material-icons text-base">storefront</span>
            Browse Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Page ─────────── */

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="relative min-h-screen bg-background-dark overflow-x-hidden">
      <AnimatedBackground />
      <Navbar activeTab="app" />

      {loading ? (
        <div className="relative z-10 pt-40 pb-40 flex justify-center">
          <span className="material-icons text-4xl text-primary animate-spin">refresh</span>
        </div>
      ) : user ? (
        <>
          <ReturningHub name={user.name} role={user.role} isSuperUser={user.isSuperUser} />
          <DiscoverySection />
          <ExploreRails />
        </>
      ) : (
        <>
          <LandingHero />
          <DiscoverySection />
          <ExploreRails />
          <HowItWorks />
          <JoinBand />
        </>
      )}

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
