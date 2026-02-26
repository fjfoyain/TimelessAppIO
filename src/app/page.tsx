import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import WhatsAppFAB from "@/components/landing/WhatsAppFAB";
import Footer from "@/components/landing/Footer";

/* ─────────── Data ─────────── */

const roles = [
  {
    label: "Artist",
    icon: "music_note",
    tagline: "Share your sound",
    href: "/register/artist",
    hoverColor: "hover:border-primary/60 hover:shadow-[0_0_24px_-4px_rgba(127,19,236,0.45)]",
    iconColor: "text-primary",
  },
  {
    label: "Venue",
    icon: "stadium",
    tagline: "Host the vibe",
    href: "/register/venue",
    hoverColor: "hover:border-pink-500/60 hover:shadow-[0_0_24px_-4px_rgba(236,72,153,0.45)]",
    iconColor: "text-pink-500",
  },
  {
    label: "Talent",
    icon: "stars",
    tagline: "Grow career",
    href: "/register/talent",
    hoverColor: "hover:border-cyan-500/60 hover:shadow-[0_0_24px_-4px_rgba(6,182,212,0.45)]",
    iconColor: "text-cyan-500",
  },
  {
    label: "Client",
    icon: "diamond",
    tagline: "Hire & Organize",
    href: "/register/client",
    hoverColor: "hover:border-amber-500/60 hover:shadow-[0_0_24px_-4px_rgba(245,158,11,0.45)]",
    iconColor: "text-amber-500",
  },
] as const;

const stats = [
  { value: "10k+", label: "Artists Registered", hoverColor: "hover:text-primary" },
  { value: "500+", label: "Verified Venues", hoverColor: "hover:text-pink-500" },
  { value: "200+", label: "Active Clients", hoverColor: "hover:text-amber-500" },
  { value: "Global", label: "Community", hoverColor: "hover:text-accent-cyan" },
] as const;

const lineupSlots = [
  { time: "8 PM", artist: "Opening Set" },
  { time: "9 PM", artist: "SUKI" },
  { time: "10 PM", artist: "DJ K-O" },
  { time: "11 PM", artist: "Afterhours" },
] as const;

/* ─────────── Page ─────────── */

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background-dark overflow-x-hidden">
      {/* ── Animated Background ── */}
      <AnimatedBackground />

      {/* ── Navbar ── */}
      <Navbar activeTab="app" />

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-28 pb-16 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* ─── Left Column ─── */}
            <div className="flex flex-col gap-8">
              {/* Beta Badge */}
              <div className="inline-flex items-center self-start gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
                <span className="text-xs font-medium text-primary-light tracking-wide">
                  Now in Beta v2.0
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tighter leading-[0.95]">
                Connect the
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent text-glow">
                  Frequency.
                </span>
              </h1>

              {/* Description */}
              <p className="border-l-2 border-primary/30 pl-6 text-slate-400 text-lg leading-relaxed max-w-lg">
                Timeless bridges the gap between creation and performance. The
                ultimate ecosystem connecting artists, venues, and industry
                talent in one seamless rhythm.
              </p>

              {/* Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {roles.map((role) => (
                  <Link
                    key={role.label}
                    href={role.href}
                    className={`group relative flex flex-col items-center justify-center gap-3 h-[180px] rounded-2xl border border-white/5 bg-card-dark transition-all duration-300 hover:-translate-y-1 ${role.hoverColor}`}
                  >
                    <span
                      className={`material-icons text-4xl ${role.iconColor} opacity-80 group-hover:opacity-100 transition-opacity`}
                    >
                      {role.icon}
                    </span>
                    <span className="text-sm font-semibold text-white tracking-wide">
                      {role.label}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                      {role.tagline}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Browse Marketplace CTA */}
              <Link
                href="/marketplace"
                className="group flex items-center justify-center gap-2 w-full rounded-xl border border-slate-800 bg-white/5 px-6 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-300"
              >
                Browse Marketplace
                <span className="material-icons text-lg opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* ─── Right Column: Phone Mockup ─── */}
            <div className="hidden lg:flex items-center justify-center relative">
              {/* Phone Frame */}
              <div className="relative w-[380px] h-[720px] rounded-[3rem] border-[6px] border-slate-800 bg-black overflow-hidden shadow-2xl shadow-primary/10 animate-tilt">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30" />

                {/* Concert Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/hero-concert.jpg"
                    alt="Live concert atmosphere"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* LIVE NOW Badge */}
                  <div className="absolute top-10 left-5 z-20 flex items-center gap-2 rounded-full bg-red-600/90 backdrop-blur-sm px-3 py-1">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase">
                      Live Now
                    </span>
                  </div>

                  {/* DJ Profile */}
                  <div className="absolute bottom-36 left-5 right-5 z-20 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/60 flex-shrink-0">
                      <Image
                        src="/images/dj-profile.jpg"
                        alt="DJ K-O"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">DJ K-O</p>
                      <p className="text-[11px] text-slate-400">
                        Underground Club &bull; Tokyo
                      </p>
                    </div>
                  </div>

                  {/* Tonight's Lineup Card */}
                  <div className="absolute bottom-5 left-4 right-4 z-20 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Tonight&apos;s Lineup
                    </p>
                    <div className="space-y-2">
                      {lineupSlots.map((slot) => (
                        <div
                          key={slot.time}
                          className="flex items-center justify-between"
                        >
                          <span className="text-[11px] font-medium text-primary-light">
                            {slot.time}
                          </span>
                          <span className="text-[11px] text-slate-300">
                            {slot.artist}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Floating Notifications ── */}

              {/* Booking Confirmed - top right */}
              <div className="absolute -top-2 -right-4 z-30 animate-float-slow">
                <div className="flex items-center gap-3 rounded-2xl bg-surface-dark/90 backdrop-blur-md border border-white/10 px-4 py-3 shadow-lg">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500/20">
                    <span className="material-icons text-green-400 text-lg">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Booking Confirmed
                    </p>
                    <p className="text-[10px] text-slate-500">Just now</p>
                  </div>
                </div>
              </div>

              {/* New Client Offer - bottom left */}
              <div className="absolute -bottom-4 -left-8 z-30 animate-float-delayed">
                <div className="flex items-center gap-3 rounded-2xl bg-surface-dark/90 backdrop-blur-md border border-white/10 px-4 py-3 shadow-lg">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-500/20">
                    <span className="material-icons text-amber-400 text-lg">
                      paid
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      New Client Offer
                    </p>
                    <p className="text-[10px] text-amber-400 font-bold">
                      $2,500
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <p
                  className={`text-3xl font-black text-white transition-colors duration-300 ${stat.hoverColor}`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Links & Copyright */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8">
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-slate-600 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-600 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} Timeless. All rights reserved.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── WhatsApp FAB ── */}
      <WhatsAppFAB />
    </div>
  );
}
