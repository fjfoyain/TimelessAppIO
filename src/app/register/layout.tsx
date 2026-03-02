import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Timeless",
  description: "Create your Timeless account. Join as an artist, talent, client, or venue and start connecting.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
