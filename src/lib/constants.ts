// Shared taxonomy used across registration, the marketplace filters and the
// browse hub. Keep these in one place so filtering stays consistent.

export const EVENT_TYPES = [
  "Birthday Parties",
  "Weddings",
  "Baby Showers",
  "Bachelor / Bachelorette",
  "Corporate Events",
  "Private Parties",
  "Club Nights",
  "Festivals",
];

export const PROVIDER_CATEGORIES = [
  "DJ / Producer",
  "Live Band",
  "Concert Photographer",
  "Videographer/Editor",
  "Sound Engineer",
  "Lighting Technician",
  "Event Promoter",
];

// Material icon name for each event type — used by the browse hub.
export const EVENT_TYPE_ICONS: Record<string, string> = {
  "Birthday Parties": "cake",
  Weddings: "favorite",
  "Baby Showers": "child_friendly",
  "Bachelor / Bachelorette": "celebration",
  "Corporate Events": "business_center",
  "Private Parties": "nightlife",
  "Club Nights": "music_note",
  Festivals: "festival",
};

export const PROVIDER_CATEGORY_ICONS: Record<string, string> = {
  "DJ / Producer": "headphones",
  "Live Band": "music_note",
  "Concert Photographer": "photo_camera",
  "Videographer/Editor": "movie",
  "Sound Engineer": "graphic_eq",
  "Lighting Technician": "wb_incandescent",
  "Event Promoter": "campaign",
};

// ─── Launch scope ────────────────────────────────────────────────
//
// The pilot launches with one category in one city. While this is set, the
// marketplace, the sitemap, the browse hubs and talent registration only deal
// with that niche. Profiles outside it keep existing and stay reachable by
// link; they are simply not listed. Set to `null` to open every category and
// city again — nothing else has to change.
export const LAUNCH_SCOPE: { category: string; city: string } | null = {
  category: "DJ / Producer",
  city: "Quito",
};

export const CITIES = ["Quito", "Guayaquil", "Cuenca"];

export const ACTIVE_PROVIDER_CATEGORIES = LAUNCH_SCOPE ? [LAUNCH_SCOPE.category] : PROVIDER_CATEGORIES;
export const ACTIVE_CITIES = LAUNCH_SCOPE ? [LAUNCH_SCOPE.city] : CITIES;

export function inLaunchScope(talent: { category?: string; city?: string }): boolean {
  return !LAUNCH_SCOPE || (talent.category === LAUNCH_SCOPE.category && talent.city === LAUNCH_SCOPE.city);
}
