import Link from "next/link";

export const metadata = {
  title: "Register - Timeless",
  description:
    "Join the Timeless ecosystem. Choose your role and start connecting with artists, venues, clients, and talent worldwide.",
};

const roles = [
  {
    label: "Artist",
    icon: "music_note",
    description:
      "Share your sound with the world. Connect with studios, producers, and venues to elevate your craft and grow your audience.",
    href: "/register/artist",
    borderHover:
      "hover:border-primary/60 hover:shadow-[0_0_32px_-4px_rgba(127,19,236,0.5)]",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    tagColor: "text-primary",
  },
  {
    label: "Client",
    icon: "diamond",
    description:
      "Hire top-tier talent, manage productions, and curate unforgettable experiences. Your next event starts here.",
    href: "/register/client",
    borderHover:
      "hover:border-amber-500/60 hover:shadow-[0_0_32px_-4px_rgba(245,158,11,0.5)]",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    tagColor: "text-amber-500",
  },
  {
    label: "Talent",
    icon: "stars",
    description:
      "Showcase your skills as a DJ, engineer, producer, or session musician. Get discovered and booked by top clients.",
    href: "/register/talent",
    borderHover:
      "hover:border-cyan-500/60 hover:shadow-[0_0_32px_-4px_rgba(6,182,212,0.5)]",
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    tagColor: "text-cyan-500",
  },
  {
    label: "Venue",
    icon: "stadium",
    description:
      "List your space, manage bookings, and host the vibe. From intimate clubs to festival stages, reach the right artists.",
    href: "/register/venue",
    borderHover:
      "hover:border-pink-500/60 hover:shadow-[0_0_32px_-4px_rgba(236,72,153,0.5)]",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    tagColor: "text-pink-500",
  },
] as const;

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-background-dark flex flex-col items-center justify-center px-4 py-16">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent-fuchsia/10 blur-[160px]" />

      {/* Logo */}
      <Link href="/" className="mb-12 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="material-icons text-white text-lg">graphic_eq</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Timeless
        </span>
      </Link>

      {/* Header */}
      <div className="text-center max-w-2xl mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          How will you use{" "}
          <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
            Timeless
          </span>
          ?
        </h1>
        <p className="mt-4 text-lg text-slate-400 font-light">
          Choose your role to get started. You can always add more roles later.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {roles.map((role) => (
          <Link
            key={role.label}
            href={role.href}
            className={`group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all duration-300 hover:-translate-y-1 ${role.borderHover}`}
          >
            {/* Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${role.iconBg}`}
            >
              <span
                className={`material-icons text-3xl ${role.iconColor} opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                {role.icon}
              </span>
            </div>

            {/* Title + Arrow */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{role.label}</h2>
              <span className="material-icons text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                arrow_forward
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed">
              {role.description}
            </p>

            {/* Tag */}
            <span
              className={`text-xs font-medium ${role.tagColor} tracking-wide`}
            >
              Get Started &rarr;
            </span>
          </Link>
        ))}
      </div>

      {/* Footer link */}
      <p className="mt-12 text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary-light transition-colors font-medium"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
