import type { Metadata } from "next";

export const metadata: Metadata = {
  // Re-declares the brand template so talent profiles at /marketplace/[id]
  // inherit it; a plain string here would consume the root template.
  title: { default: "Marketplace - Timeless", template: "%s | Timeless" },
  description: "Browse and hire talented artists, musicians, DJs, photographers and more on the Timeless marketplace.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
