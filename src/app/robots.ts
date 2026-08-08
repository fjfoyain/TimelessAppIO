import type { MetadataRoute } from "next";
import { SITE_URL, PRIVATE_ROUTES } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated and admin areas. These also emit `noindex` in their own
      // metadata — this is the cheaper first line, not the only one, since
      // robots.txt stops crawling but not indexing of externally linked URLs.
      disallow: PRIVATE_ROUTES.map((r) => `${r}/`),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
