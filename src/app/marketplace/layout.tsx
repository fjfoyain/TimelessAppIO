import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace - Timeless",
  description: "Browse and hire talented artists, musicians, DJs, photographers and more on the Timeless marketplace.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
