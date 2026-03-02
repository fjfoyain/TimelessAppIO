import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support - Timeless",
  description: "Get in touch with the Timeless support team. 24/7 hotline, WhatsApp concierge, and priority email support.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
