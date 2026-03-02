import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In - Timeless",
  description: "Log in to your Timeless account to manage bookings, events, and connect with talent.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
