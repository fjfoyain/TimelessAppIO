import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - Timeless",
  description: "Timeless is launching soon. Join the waitlist to get exclusive early access to the platform.",
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
