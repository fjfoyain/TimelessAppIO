import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { blogPosts } from "@/data/blogPosts";
import { getPublicVenues, getPublicEvents, getPublicTalents } from "@/lib/publicData";

// Public, indexable routes. Anything behind auth lives in PRIVATE_ROUTES and is
// deliberately absent.
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/marketplace", changeFrequency: "daily", priority: 0.9 },
  { path: "/venues", changeFrequency: "daily", priority: 0.9 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
  { path: "/studio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/studio/classes", changeFrequency: "weekly", priority: 0.7 },
  { path: "/search", changeFrequency: "weekly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/register", changeFrequency: "monthly", priority: 0.7 },
  { path: "/login", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/help", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Listing pages. These read Firestore over REST; each helper fails soft, so a
  // backend hiccup yields a smaller sitemap rather than a build failure.
  const [talents, venues, events] = await Promise.all([
    getPublicTalents(),
    getPublicVenues(),
    getPublicEvents(),
  ]);

  const talentEntries: MetadataRoute.Sitemap = talents.map((t) => ({
    url: `${SITE_URL}/marketplace/${t.id}`,
    lastModified: t.updatedAt ? new Date(t.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const venueEntries: MetadataRoute.Sitemap = venues.map((v) => ({
    url: `${SITE_URL}/venues/${v.id}`,
    lastModified: v.updatedAt ? new Date(v.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/events/${e.id}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...blogEntries,
    ...talentEntries,
    ...venueEntries,
    ...eventEntries,
  ];
}
