import { inLaunchScope } from "./constants";
// Server-side reads of the public Firestore collections, over the REST API.
//
// The client SDK in `firestore.ts` runs in the browser; sitemap generation and
// `generateMetadata` run on the server, before React hydrates, and need the data
// there. No credentials are involved: `talents`, `venues` and `events` are
// `allow read: if true` in firestore.rules, so an unauthenticated REST read is
// exactly what a search-engine crawler already sees.
//
// Every helper fails soft — SEO metadata must never take a page down.

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Cache for an hour: listings change far more slowly than they are crawled.
const REVALIDATE_SECONDS = 3600;

type FirestoreValue = Record<string, unknown>;

interface FirestoreDoc {
  name: string;
  fields?: Record<string, FirestoreValue>;
  updateTime?: string;
}

// Firestore REST wraps every value in a type tag ({ stringValue: "x" }).
// Unwrap recursively into plain JS.
function unwrap(value: FirestoreValue): unknown {
  if (!value || typeof value !== "object") return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) {
    const arr = (value.arrayValue as { values?: FirestoreValue[] })?.values ?? [];
    return arr.map(unwrap);
  }
  if ("mapValue" in value) {
    const map = (value.mapValue as { fields?: Record<string, FirestoreValue> })?.fields ?? {};
    return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, unwrap(v)]));
  }
  return undefined;
}

function toPlain(doc: FirestoreDoc): Record<string, unknown> & { id: string } {
  const fields = doc.fields ?? {};
  const data = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, unwrap(v)])
  );
  return { ...data, id: doc.name.split("/").pop() as string, _updateTime: doc.updateTime };
}

async function fetchCollection(
  collection: string,
  pageSize = 300
): Promise<Array<Record<string, unknown> & { id: string }>> {
  if (!PROJECT_ID) return [];
  try {
    const res = await fetch(`${BASE}/${collection}?pageSize=${pageSize}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { documents?: FirestoreDoc[] };
    return (json.documents ?? []).map(toPlain);
  } catch {
    return [];
  }
}

async function fetchDoc(
  collection: string,
  id: string
): Promise<(Record<string, unknown> & { id: string }) | null> {
  if (!PROJECT_ID || !id) return null;
  try {
    const res = await fetch(`${BASE}/${collection}/${encodeURIComponent(id)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as FirestoreDoc;
    if (!json.name) return null;
    return toPlain(json);
  } catch {
    return null;
  }
}

// ─── Typed accessors ──────────────────────────────────────────────

export interface PublicVenue {
  id: string;
  venueName?: string;
  address?: string;
  capacity?: number;
  eventTypes?: string[];
  updatedAt?: string;
}

export interface PublicEvent {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  image?: string;
  status?: string;
  updatedAt?: string;
}

export interface PublicTalent {
  id: string;
  name?: string;
  category?: string;
  city?: string;
  bio?: string;
  updatedAt?: string;
}

export async function getPublicVenues(): Promise<PublicVenue[]> {
  const docs = await fetchCollection("venues");
  return docs.map((d) => ({
    id: d.id,
    venueName: d.venueName as string | undefined,
    address: d.address as string | undefined,
    capacity: d.capacity as number | undefined,
    eventTypes: d.eventTypes as string[] | undefined,
    updatedAt: d._updateTime as string | undefined,
  }));
}

export async function getPublicVenue(id: string): Promise<PublicVenue | null> {
  const d = await fetchDoc("venues", id);
  if (!d) return null;
  return {
    id: d.id,
    venueName: d.venueName as string | undefined,
    address: d.address as string | undefined,
    capacity: d.capacity as number | undefined,
    eventTypes: d.eventTypes as string[] | undefined,
  };
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  const docs = await fetchCollection("events");
  return docs
    .map((d) => ({
      id: d.id,
      title: d.title as string | undefined,
      description: d.description as string | undefined,
      location: d.location as string | undefined,
      date: d.date as string | undefined,
      image: d.image as string | undefined,
      status: d.status as string | undefined,
      updatedAt: d._updateTime as string | undefined,
    }))
    .filter((e) => e.status !== "draft" && e.status !== "cancelled");
}

export async function getPublicEvent(id: string): Promise<PublicEvent | null> {
  const d = await fetchDoc("events", id);
  if (!d) return null;
  return {
    id: d.id,
    title: d.title as string | undefined,
    description: d.description as string | undefined,
    location: d.location as string | undefined,
    date: d.date as string | undefined,
    image: d.image as string | undefined,
    status: d.status as string | undefined,
  };
}

export async function getPublicTalents(): Promise<PublicTalent[]> {
  // Only approved accounts are public listings (mirrors getAllTalents).
  const docs = (await fetchCollection("talents")).filter(
    (d) =>
      d.isApproved === true &&
      inLaunchScope({ category: d.category as string | undefined, city: d.city as string | undefined })
  );
  return docs.map((d) => ({
    id: d.id,
    name: d.name as string | undefined,
    category: d.category as string | undefined,
    city: d.city as string | undefined,
    bio: d.bio as string | undefined,
    updatedAt: d._updateTime as string | undefined,
  }));
}

export async function getPublicTalent(id: string): Promise<PublicTalent | null> {
  const d = await fetchDoc("talents", id);
  if (!d || d.isApproved !== true) return null;
  return {
    id: d.id,
    name: d.name as string | undefined,
    category: d.category as string | undefined,
    city: d.city as string | undefined,
    bio: d.bio as string | undefined,
  };
}
