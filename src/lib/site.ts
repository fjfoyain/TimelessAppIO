// Canonical origin for absolute URLs in metadata, sitemap and JSON-LD.
// Override with NEXT_PUBLIC_SITE_URL when running on a preview domain so
// OpenGraph images and canonicals point at the deployment being previewed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://timelessapp.io"
).replace(/\/$/, "");

export const SITE_NAME = "Timeless";

// Routes behind auth or admin: never indexed, never in the sitemap.
export const PRIVATE_ROUTES = [
  "/admin",
  "/dashboard",
  "/wallet",
  "/messages",
  "/notifications",
  "/settings",
  "/booking",
  "/tickets",
  "/logout",
  "/offline",
  "/maintenance",
  "/services/new",
  "/events/create",
  "/forgot-password",
];
