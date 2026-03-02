import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center - Timeless",
  description: "Find answers to common questions about bookings, payments, accounts, and more on Timeless.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
