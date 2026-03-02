import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio - Timeless",
  description: "Discover recording studios, book sessions, and explore music production classes on Timeless.",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
