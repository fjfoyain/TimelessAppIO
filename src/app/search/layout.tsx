import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search - Timeless",
  description: "Search for artists, venues, services, and events on the Timeless platform.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
