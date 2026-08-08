import type { Metadata } from "next";

export const metadata: Metadata = {
  // See the note in venues/layout.tsx — the template must be re-declared so
  // /events/[id] inherits the branding.
  title: { default: "Events", template: "%s | Timeless" },
  description:
    "Discover live music events, festivals and private parties. Browse line-ups, venues and ticket tiers, and book the talent behind them on Timeless.",
  alternates: { canonical: "/events" },
  openGraph: {
    type: "website",
    title: "Events | Timeless",
    description:
      "Discover live music events, festivals and private parties, and book the talent behind them.",
    url: "/events",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
