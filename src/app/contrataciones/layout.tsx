import type { Metadata } from "next";

// Authenticated area — kept out of the index.
export const metadata: Metadata = {
  title: "Booking",
  robots: { index: false, follow: false },
};

export default function ContratacionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
