/**
 * Shared Firebase Admin setup for the scripts in this folder.
 *
 * Requires scripts/serviceAccountKey.json (Firebase Console → Project Settings
 * → Service Accounts → Generate new private key). It is gitignored — never
 * commit it: with it, a script bypasses every security rule.
 */

const path = require("path");

let app, firestore, authModule;
try {
  app = require("firebase-admin/app");
  firestore = require("firebase-admin/firestore");
  authModule = require("firebase-admin/auth");
} catch {
  console.error("\n  ❌  firebase-admin is not installed. Run: npm install\n");
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

app.initializeApp({ credential: app.cert(serviceAccount) });

module.exports = {
  auth: authModule.getAuth(),
  db: firestore.getFirestore(),
  FieldValue: firestore.FieldValue,
};
