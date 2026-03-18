/**
 * create-demo-user.js
 *
 * One-time setup script that creates the Timeless demo / super-user account.
 * Run once from the project root:
 *
 *   node scripts/create-demo-user.js
 *
 * Prerequisites:
 *   1. Install the Firebase Admin SDK:
 *        npm install firebase-admin --save-dev
 *   2. Download your Firebase service account key from
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *      and save it as:  scripts/serviceAccountKey.json
 *      (This file is gitignored — never commit it.)
 *
 * What it does:
 *   - Creates a Firebase Auth user:  demo@timeless.io / Demo1234!
 *   - Creates the Firestore users/{uid} document with isSuperUser: true
 *   - Idempotent: safe to run multiple times (won't overwrite an existing user)
 */

const path = require("path");

// ---------------------------------------------------------------------------
// Load Firebase Admin
// ---------------------------------------------------------------------------
let admin;
try {
  admin = require("firebase-admin");
} catch {
  console.error(
    '\n  ❌  firebase-admin is not installed.\n' +
    '     Run:  npm install firebase-admin --save-dev\n'
  );
  process.exit(1);
}

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch {
  console.error(
    '\n  ❌  Service account key not found at scripts/serviceAccountKey.json\n' +
    '     Download it from Firebase Console → Project Settings → Service Accounts.\n' +
    '     Make sure it is NOT committed to git.\n'
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

// ---------------------------------------------------------------------------
// Demo user definition
// ---------------------------------------------------------------------------
const DEMO_EMAIL = "demo@timeless.io";
const DEMO_PASSWORD = "Demo1234!";
const DEMO_NAME = "Demo User";

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("\n🚀  Creating Timeless demo user…\n");

  // 1. Create (or fetch) the Firebase Auth user
  let uid;
  try {
    const existing = await auth.getUserByEmail(DEMO_EMAIL);
    uid = existing.uid;
    console.log(`  ℹ️   Auth user already exists  (uid: ${uid})`);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      const newUser = await auth.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        displayName: DEMO_NAME,
        emailVerified: true,
      });
      uid = newUser.uid;
      console.log(`  ✅  Auth user created         (uid: ${uid})`);
    } else {
      throw err;
    }
  }

  // 2. Create (or update) the Firestore user document
  const userRef = db.collection("users").doc(uid);
  const snapshot = await userRef.get();

  if (snapshot.exists) {
    await userRef.update({ isSuperUser: true });
    console.log("  ✅  Firestore document updated  (isSuperUser: true)");
  } else {
    await userRef.set({
      id: uid,
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      role: "ADMIN",
      status: "Active",
      avatar: "",
      isSuperUser: true,
      createdAt: new Date().toISOString(),
    });
    console.log("  ✅  Firestore document created");
  }

  console.log(`
  ──────────────────────────────────────────
  Demo account ready:
    Email:    ${DEMO_EMAIL}
    Password: ${DEMO_PASSWORD}
  ──────────────────────────────────────────

  This account has isSuperUser: true which gives it access to all
  dashboard sections, admin panel, and every protected route.
  `);

  process.exit(0);
}

main().catch((err) => {
  console.error("\n  ❌  Unexpected error:", err.message);
  process.exit(1);
});
