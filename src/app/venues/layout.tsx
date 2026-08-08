import type { Metadata } from "next";

export const metadata: Metadata = {
  // A plain string here would consume the root template and leave none for
  // /venues/[id], so the branding is re-declared for the child segments.
  title: { default: "Venues", template: "%s | Timeless" },
  description:
    "Browse venues for concerts, private events and sessions — capacity, equipment and event types, with direct booking through Timeless.",
  alternates: { canonical: "/venues" },
  openGraph: {
    type: "website",
    title: "Venues | Timeless",
    description:
      "Browse venues for concerts, private events and sessions, with direct booking.",
    url: "/venues",
  },
};

export default function VenuesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
