/**
 * seed-demo.js
 *
 * Seeds the Timeless Firestore database with coherent demo data so the
 * marketplace, event creation wizard, studio classes and admin panels
 * all have something to show.
 *
 * Run from the project root:
 *
 *   node scripts/seed-demo.js
 *
 * Prerequisites:
 *   1. Firebase Admin SDK installed:  npm install firebase-admin --save-dev
 *   2. Service account key saved as:  scripts/serviceAccountKey.json
 *      (Firebase Console → Project Settings → Service Accounts → Generate new private key)
 *      This file is gitignored — never commit it.
 *
 * What it creates:
 *   - 3 venue accounts   (Auth user + users/{uid} + venues/{uid})
 *   - 4 talent accounts  (Auth user + users/{uid} + talents/{uid})
 *   - 6 studio courses
 *   - 7 marketplace categories
 *   - 3 pending approvals
 *
 * Idempotent: re-running it reuses existing Auth users and overwrites their
 * Firestore docs, and skips collections that already contain data.
 *
 * Default password for every seeded account:  Demo1234!
 */

const path = require("path");

let admin;
try {
  admin = require("firebase-admin");
} catch {
  console.error(
    "\n  ❌  firebase-admin is not installed.\n" +
      "     Run:  npm install firebase-admin --save-dev\n"
  );
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
} catch {
  console.error(
    "\n  ❌  Service account key not found at scripts/serviceAccountKey.json\n" +
      "     Download it from Firebase Console → Project Settings → Service Accounts.\n"
  );
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const auth = admin.auth();
const db = admin.firestore();
const now = () => admin.firestore.FieldValue.serverTimestamp();

const DEFAULT_PASSWORD = "Demo1234!";

// ─── Demo data ──────────────────────────────────────────────────

const VENUES = [
  {
    email: "venue.neon@timeless.io",
    name: "Neon Garden Rooftop",
    venueName: "Neon Garden Rooftop",
    address: "Av. Amazonas 1234, Quito",
    capacity: 320,
    eventTypes: ["House", "Techno", "Private Parties"],
    equipment: "Funktion-One sound system, full LED wall, DJ booth",
    website: "https://neongarden.example.com",
  },
  {
    email: "venue.harbor@timeless.io",
    name: "Harbor Concert Hall",
    venueName: "Harbor Concert Hall",
    address: "Malecón 2000, Guayaquil",
    capacity: 900,
    eventTypes: ["Live Jazz", "Classical", "Corporate"],
    equipment: "Grand stage, professional lighting rig, green rooms",
    website: "https://harborhall.example.com",
  },
  {
    email: "venue.basement@timeless.io",
    name: "The Basement",
    venueName: "The Basement",
    address: "Calle La Ronda 56, Quito",
    capacity: 140,
    eventTypes: ["Techno", "House"],
    equipment: "Intimate club setup, analog sound system",
  },
];

const TALENTS = [
  {
    email: "talent.luna@timeless.io",
    name: "Luna Vega",
    avatar: "",
    category: "DJ / Producer",
    city: "Quito",
    bio: "Melodic techno DJ with 6 years spinning rooftop and club sets across the Andes.",
    tags: ["Techno", "Melodic", "Vinyl"],
    hourlyRate: 180,
    experience: "veteran",
    isVerified: true,
    jobsCompleted: 48,
    responseRate: 98,
  },
  {
    email: "talent.marco@timeless.io",
    name: "Marco Reyes",
    avatar: "",
    category: "Concert Photographer",
    city: "Guayaquil",
    bio: "Live music and event photographer. Fast turnaround, editorial-grade edits.",
    tags: ["Photography", "Editorial", "Live"],
    hourlyRate: 120,
    experience: "pro",
    isVerified: true,
    jobsCompleted: 73,
    responseRate: 95,
  },
  {
    email: "talent.sofia@timeless.io",
    name: "Sofia Castro",
    avatar: "",
    category: "Sound Engineer",
    city: "Quito",
    bio: "FOH and monitor engineer for live shows, from intimate venues to festivals.",
    tags: ["Live Sound", "Mixing", "Festivals"],
    hourlyRate: 150,
    experience: "veteran",
    isVerified: false,
    jobsCompleted: 31,
    responseRate: 90,
  },
  {
    email: "talent.diego@timeless.io",
    name: "Diego Paredes",
    avatar: "",
    category: "Videographer/Editor",
    city: "Cuenca",
    bio: "Event recap films and aftermovies. Drone-certified, color-grade specialist.",
    tags: ["Video", "Drone", "Aftermovie"],
    hourlyRate: 140,
    experience: "pro",
    isVerified: true,
    jobsCompleted: 22,
    responseRate: 88,
  },
];

const COURSES = [
  { title: "DJ Fundamentals: Beatmatching to Live Sets", category: "DJ", instructor: "Luna Vega", price: 120, color: "#7f13ec", icon: "headphones", level: "beginner", duration: "6 weeks" },
  { title: "Live Sound Engineering Masterclass", category: "Production", instructor: "Sofia Castro", price: 220, color: "#00f0ff", icon: "graphic_eq", level: "intermediate", duration: "8 weeks" },
  { title: "Concert Photography Bootcamp", category: "Photography", instructor: "Marco Reyes", price: 160, color: "#d946ef", icon: "photo_camera", level: "beginner", duration: "4 weeks" },
  { title: "Event Aftermovie Editing", category: "Video", instructor: "Diego Paredes", price: 180, color: "#f59e0b", icon: "movie", level: "intermediate", duration: "5 weeks" },
  { title: "Music Production in Ableton Live", category: "Production", instructor: "Luna Vega", price: 240, color: "#10b981", icon: "piano", level: "advanced", duration: "10 weeks" },
  { title: "Stage Lighting Design", category: "Production", instructor: "Sofia Castro", price: 150, color: "#ef4444", icon: "wb_incandescent", level: "intermediate", duration: "6 weeks" },
];

const CATEGORIES = [
  { name: "DJ / Producer", parent: "Music", itemCount: 0, icon: "headphones" },
  { name: "Live Band", parent: "Music", itemCount: 0, icon: "music_note" },
  { name: "Sound Engineer", parent: "Production", itemCount: 0, icon: "graphic_eq" },
  { name: "Lighting Technician", parent: "Production", itemCount: 0, icon: "wb_incandescent" },
  { name: "Concert Photographer", parent: "Media", itemCount: 0, icon: "photo_camera" },
  { name: "Videographer/Editor", parent: "Media", itemCount: 0, icon: "movie" },
  { name: "Event Promoter", parent: "Operations", itemCount: 0, icon: "campaign" },
];

const APPROVALS = [
  { name: "Neon Garden Rooftop", type: "Venue", description: "New rooftop venue awaiting verification.", avatar: "", status: "pending" },
  { name: "Sofia Castro", type: "Talent", description: "Sound engineer profile pending review.", avatar: "", status: "pending" },
  { name: "Andes Beats Festival", type: "Event", description: "Large outdoor festival pending approval.", avatar: "", status: "pending" },
];

// ─── Helpers ────────────────────────────────────────────────────

async function ensureAuthUser(email, displayName) {
  try {
    const existing = await auth.getUserByEmail(email);
    return existing.uid;
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      const created = await auth.createUser({
        email,
        password: DEFAULT_PASSWORD,
        displayName,
        emailVerified: true,
      });
      return created.uid;
    }
    throw err;
  }
}

async function isCollectionEmpty(name) {
  const snap = await db.collection(name).limit(1).get();
  return snap.empty;
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱  Seeding Timeless demo data…\n");

  // Venues
  for (const v of VENUES) {
    const uid = await ensureAuthUser(v.email, v.name);
    await db.collection("users").doc(uid).set({
      name: v.name,
      email: v.email,
      role: "VENUE",
      avatar: "",
      status: "Active",
      createdAt: now(),
    });
    await db.collection("venues").doc(uid).set({
      userId: uid,
      venueName: v.venueName,
      address: v.address,
      capacity: v.capacity,
      eventTypes: v.eventTypes,
      ...(v.equipment ? { equipment: v.equipment } : {}),
      ...(v.website ? { website: v.website } : {}),
      createdAt: now(),
    });
    console.log(`  ✅  Venue: ${v.venueName}`);
  }

  // Talents
  for (const t of TALENTS) {
    const uid = await ensureAuthUser(t.email, t.name);
    await db.collection("users").doc(uid).set({
      name: t.name,
      email: t.email,
      role: "TALENT",
      avatar: t.avatar,
      status: "Active",
      createdAt: now(),
    });
    await db.collection("talents").doc(uid).set({
      userId: uid,
      // Denormalized public fields for the marketplace (see S3).
      name: t.name,
      avatar: t.avatar,
      category: t.category,
      city: t.city,
      bio: t.bio,
      tags: t.tags,
      hourlyRate: t.hourlyRate,
      baseRate: t.hourlyRate,
      ratePer: "Hour",
      experience: t.experience,
      isVerified: t.isVerified,
      jobsCompleted: t.jobsCompleted,
      responseRate: t.responseRate,
      portfolio: [],
      reviews: [],
      servicePlans: [],
      createdAt: now(),
    });
    console.log(`  ✅  Talent: ${t.name}`);
  }

  // Courses (only if empty)
  if (await isCollectionEmpty("courses")) {
    for (const c of COURSES) {
      await db.collection("courses").add({ ...c, createdAt: now() });
    }
    console.log(`  ✅  Courses: ${COURSES.length} created`);
  } else {
    console.log("  ℹ️   Courses collection not empty — skipped");
  }

  // Categories (only if empty)
  if (await isCollectionEmpty("categories")) {
    for (const c of CATEGORIES) {
      await db.collection("categories").add(c);
    }
    console.log(`  ✅  Categories: ${CATEGORIES.length} created`);
  } else {
    console.log("  ℹ️   Categories collection not empty — skipped");
  }

  // Approvals (only if empty)
  if (await isCollectionEmpty("approvals")) {
    for (const a of APPROVALS) {
      await db.collection("approvals").add({
        ...a,
        submittedDate: new Date().toISOString().slice(0, 10),
        createdAt: now(),
      });
    }
    console.log(`  ✅  Approvals: ${APPROVALS.length} created`);
  } else {
    console.log("  ℹ️   Approvals collection not empty — skipped");
  }

  console.log(`
  ──────────────────────────────────────────
  Seed complete.
    Seeded accounts password:  ${DEFAULT_PASSWORD}
    Venue logins:   ${VENUES.map((v) => v.email).join(", ")}
    Talent logins:  ${TALENTS.map((t) => t.email).join(", ")}
  ──────────────────────────────────────────
  `);

  process.exit(0);
}

main().catch((err) => {
  console.error("\n  ❌  Seed failed:", err.message);
  process.exit(1);
});
