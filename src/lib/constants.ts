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
