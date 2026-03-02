import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Timeless",
  description: "Your Timeless dashboard. Manage events, bookings, wallet, and profile from one place.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
