import type { Metadata } from "next";

// Authenticated area — kept out of the index. robots.ts also disallows it, but
// that only stops crawling; this is what prevents indexing of a URL someone
// links to from outside.
export const metadata: Metadata = {
  title: "Publish a service",
  robots: { index: false, follow: false },
};

export default function NewServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
