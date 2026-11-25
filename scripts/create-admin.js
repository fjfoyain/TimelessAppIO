/**
 * create-admin.js
 *
 * Grants admin access (isSuperUser) to an account, creating it if needed.
 * Run from the project root:
 *
 *   ADMIN_EMAIL=you@example.com node scripts/create-admin.js
 *
 * If the account does not exist yet, ADMIN_PASSWORD is also required:
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' node scripts/create-admin.js
 *
 * Credentials are never written in this file: anything committed here is
 * readable by everyone with access to the repository.
 *
 * Requires scripts/serviceAccountKey.json (Firebase Console → Project
 * Settings → Service Accounts → Generate new private key). It is gitignored —
 * never commit it.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL) {
  console.error("\n  ❌  Set ADMIN_EMAIL to the account that should become admin.\n");
  process.exit(1);
}

const { auth, db } = require("./admin-sdk");

async function main() {
  let uid;
  try {
    uid = (await auth.getUserByEmail(ADMIN_EMAIL)).uid;
    console.log(`  ℹ️   Account already exists (uid: ${uid})`);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    if (!ADMIN_PASSWORD) {
      console.error(
        `\n  ❌  ${ADMIN_EMAIL} does not exist yet. Set ADMIN_PASSWORD to create it.\n`
      );
      process.exit(1);
    }
    const created = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      emailVerified: true,
    });
    uid = created.uid;
    console.log(`  ✅  Account created (uid: ${uid})`);
  }

  const userRef = db.collection("users").doc(uid);
  if ((await userRef.get()).exists) {
    await userRef.update({ isSuperUser: true });
  } else {
    await userRef.set({
      id: uid,
      name: "Admin",
      email: ADMIN_EMAIL,
      role: "ADMIN",
      status: "Active",
      avatar: "",
      isSuperUser: true,
      createdAt: new Date().toISOString(),
    });
  }

  console.log(`  ✅  ${ADMIN_EMAIL} now has admin access.\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\n  ❌  Unexpected error:", err.message);
  process.exit(1);
});
