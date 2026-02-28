import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import Footer from "@/components/landing/Footer";
import WhatsAppFAB from "@/components/landing/WhatsAppFAB";

export const metadata = {
  title: "Timeless Studio - Craft Your Legacy",
  description:
    "Professional recording studios, acoustically treated rooms, and world-class gear. Book a session at Timeless Studio.",
};

/* ------------------------------------------------------------------ */
/*  Reusable sub-components (server-side, co-located)                 */
/* ------------------------------------------------------------------ */

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-light">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      {children}
    </span>
  );
}

function StarIcons({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="material-icons text-yellow-400 text-sm">
          star
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function StudioPage() {
  return (
    <div className="relative min-h-screen bg-background-dark text-white">
      {/* Animated background orbs */}
      <AnimatedBackground />

      {/* Navbar */}
      <Navbar activeTab="studio" />

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative z-10 pt-32 md:pt-48 pb-20 min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* ---------- Left Column ---------- */}
            <div className="lg:col-span-7">
              <SectionBadge>New Studio Spaces Open</SectionBadge>

              <h1 className="mt-6 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
                Craft Your
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-300 to-accent-fuchsia bg-clip-text text-transparent animate-pulse-slow">
                  Legacy.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-xl font-light leading-relaxed text-gray-400">
                Step away from the screen and into a world-class recording
                environment. From pre-production to final master, we have the
                rooms, the gear, and the engineers to bring your vision to life.
              </p>

              {/* CTA buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-background-dark shadow-glow-white transition hover:bg-gray-100"
                >
                  Book a Session
                  <span className="material-icons text-base">
                    arrow_forward
                  </span>
                </a>
                <a
                  href="/studio/classes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-dark px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-surface-alt"
                >
                  Explore Classes
                </a>
              </div>

              {/* Trust bar */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <Image
                    src="/images/avatar-producer.jpg"
                    alt="Artist"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-background-dark object-cover"
                  />
                  <Image
                    src="/images/avatar-dj.jpg"
                    alt="DJ"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-background-dark object-cover"
                  />
                  <Image
                    src="/images/avatar-engineer.jpg"
                    alt="Engineer"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-background-dark object-cover"
                  />
                </div>
                <div>
                  <StarIcons count={5} />
                  <p className="text-xs text-gray-500">
                    Trusted by 500+ artists
                  </p>
                </div>
              </div>
            </div>

            {/* ---------- Right Column ---------- */}
            <div className="relative lg:col-span-5 flex items-center justify-center">
              {/* Spinning orbit rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[500px] w-[500px] animate-spin-slow rounded-full border border-white/5" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[400px] w-[400px] animate-spin-slower rounded-full border border-white/[0.03]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[300px] w-[300px] animate-spin-slowest rounded-full border border-white/[0.02]" />
              </div>

              {/* Studio hero image */}
              <div className="relative z-10 w-full overflow-hidden rounded-3xl">
                <Image
                  src="/images/hero-studio.jpg"
                  alt="Professional recording studio"
                  width={600}
                  height={600}
                  priority
                  className="h-[600px] w-full rounded-3xl object-cover"
                />
                {/* Image overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background-dark/80 via-transparent to-background-dark/20" />

                {/* Glass status panel */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    {/* Live dot */}
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">
                        Live Status &mdash; Studio&nbsp;A is Available
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        Neve 8068 Console &bull; Genelec Monitoring
                      </p>
                    </div>
                    <span className="material-icons text-primary text-2xl shrink-0">
                      graphic_eq
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CREATIVE ECOSYSTEM                                          */}
      {/* ============================================================ */}
      <section className="relative z-10 py-32 bg-surface-dark/30 border-t border-white/5">
        {/* Gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              The{" "}
              <span className="bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
                Creative Ecosystem
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400 font-light">
              Whether you&apos;re mastering the craft, performing for a crowd, or
              laying down your next track &mdash; we&apos;ve built the
              infrastructure so you can focus on what matters: the music.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Card: Academy */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#13111a] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="material-icons text-4xl text-primary">
                school
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">Academy</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Master DJing &amp; Production with hands-on workshops led by
                industry veterans. From beginner fundamentals to advanced
                techniques.
              </p>

              <div className="relative mt-6 overflow-hidden rounded-2xl">
                <Image
                  src="/images/academy-card.jpg"
                  alt="DJ Academy workshop"
                  width={400}
                  height={240}
                  className="h-48 w-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              <a
                href="/studio/classes"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-light"
              >
                Browse Curriculum
                <span className="material-icons text-base">chevron_right</span>
              </a>
            </div>

            {/* Card: Community Events */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#13111a] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-accent-fuchsia/30">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent-fuchsia/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="material-icons text-4xl text-accent-fuchsia">
                theater_comedy
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Community Events
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Intimate showcases, open decks, and networking nights designed to
                connect emerging talent with established artists and promoters.
              </p>

              <div className="relative mt-6 overflow-hidden rounded-2xl">
                <Image
                  src="/images/community-card.jpg"
                  alt="Community event"
                  width={400}
                  height={240}
                  className="h-48 w-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              <a
                href="/search"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-fuchsia transition-colors hover:text-accent-pink"
              >
                View Calendar
                <span className="material-icons text-base">chevron_right</span>
              </a>
            </div>

            {/* Card: Professional Studio */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#13111a] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="material-icons text-4xl text-purple-500">
                mic
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Professional Studio
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Acoustically treated rooms with world-class gear. From vocal
                tracking to full band recording and mixing &mdash; every session
                sounds pristine.
              </p>

              <div className="relative mt-6 overflow-hidden rounded-2xl">
                <Image
                  src="/images/studio-card.jpg"
                  alt="Professional studio room"
                  width={400}
                  height={240}
                  className="h-48 w-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              <a
                href="/booking"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                Book a Room
                <span className="material-icons text-base">chevron_right</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  THE LIVE ROOM                                               */}
      {/* ============================================================ */}
      <section className="relative z-10 py-32 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/live-room-bg.jpg"
            alt="Live room background"
            fill
            className="object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-background-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-background-dark" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Pill */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-gray-300">
            <span className="material-icons text-sm text-primary">
              verified
            </span>
            Premium Facility
          </span>

          <h2 className="mt-6 text-5xl md:text-7xl font-bold tracking-tighter">
            The Live Room
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 font-light leading-relaxed">
            Our flagship tracking room features floating floors, variable
            acoustics, and a 40-input signal path straight to our Neve 8068
            console. Whether you need thunderous drums or delicate strings, the
            Live Room delivers.
          </p>

          {/* Stats grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { value: "24/7", label: "Access" },
              { value: "A+", label: "Acoustics" },
              { value: "4", label: "Iso Booths" },
              { value: "Top", label: "Engineers" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
              >
                <p className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                 */}
      {/* ============================================================ */}
      <section id="book" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface-dark p-12 md:p-20">
            {/* Gradient bg layers */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-fuchsia/10" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent" />

            {/* Animated glow orbs */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-[100px] animate-pulse-slow" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-fuchsia/15 blur-[100px] animate-float-delayed" />

            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to Step Inside?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400 font-light">
                Whether it&apos;s your first session or your fiftieth, we make
                booking effortless. Pick a room, choose a time, and let&apos;s
                create something timeless.
              </p>

              {/* Checkmarks */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <span className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="material-icons text-green-400 text-lg">
                    check_circle
                  </span>
                  Free cancellation
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="material-icons text-green-400 text-lg">
                    check_circle
                  </span>
                  Instant confirmation
                </span>
              </div>

              <div className="mt-10">
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-sm font-semibold text-white btn-glow transition hover:bg-primary-hover hover:shadow-glow-hover"
                >
                  Book a Session
                  <span className="material-icons text-base">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <Footer />

      {/* ============================================================ */}
      {/*  WhatsApp FAB                                                */}
      {/* ============================================================ */}
      <WhatsAppFAB />
    </div>
  );
}
