import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - Timeless",
  description: "Manage your Timeless account settings, profile, security, and notification preferences.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
