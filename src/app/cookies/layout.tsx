import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Timeless uses cookies and similar technologies, what each category is for, and how to control them.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
