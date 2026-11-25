/**
 * migrate-verified-wallets.js
 *
 * One-off migration for the move to admin-verified money and admin-approved
 * marketplace listings. Run it together with the matching rules deploy.
 *
 *   node scripts/migrate-verified-wallets.js           # dry run, changes nothing
 *   node scripts/migrate-verified-wallets.js --apply   # writes the changes
 *
 * What it does:
 *   1. talents.isApproved  ← whether the owner's account is Active. The
 *      marketplace now lists only approved talents, so without this every
 *      existing profile would disappear.
 *   2. Cash deposits that the old code marked `completed` on creation were
 *      never verified by anyone. They go back to `processing` so an admin
 *      reviews them in /admin/payments.
 *   3. wallets.balance ← sum of that user's `completed` transactions. The old
 *      code added deposits to the balance while they were still `processing`
 *      (and subtracted unsent withdrawals), so stored balances overstate what
 *      was actually verified. Verifying a pending movement afterwards applies
 *      it once, instead of twice.
 *
 * Safe to run again: deposits an admin verified are never reopened.
 *
 * Requires scripts/serviceAccountKey.json (gitignored — never commit it).
 */

const { db, FieldValue } = require("./admin-sdk");

const APPLY = process.argv.includes("--apply");

const cents = (n) => Math.round(n * 100) / 100;

async function main() {
  console.log(APPLY ? "\nAPPLYING changes\n" : "\nDRY RUN — nothing is written. Pass --apply to write.\n");

  const [users, talents, txs, wallets] = await Promise.all([
    db.collection("users").get(),
    db.collection("talents").get(),
    db.collection("transactions").get(),
    db.collection("wallets").get(),
  ]);
  const statusOf = Object.fromEntries(users.docs.map((d) => [d.id, d.data().status]));
  const nameOf = Object.fromEntries(users.docs.map((d) => [d.id, d.data().name || d.id]));
  const writes = [];

  console.log("1. Marketplace listings");
  for (const t of talents.docs) {
    const approved = statusOf[t.id] === "Active";
    if (t.data().isApproved !== approved) {
      console.log(`   ${approved ? "list  " : "hide  "} ${t.data().name || t.id}  (account: ${statusOf[t.id] || "no user doc"})`);
      writes.push(() => t.ref.update({ isApproved: approved }));
    }
  }

  console.log("\n2. Cash deposits never verified → back to review");
  const reverted = new Set();
  for (const t of txs.docs) {
    const d = t.data();
    // `resolvedBy` marks a deposit an admin did verify: leave those alone, so
    // running this again after go-live never reopens verified money.
    if (d.type === "deposit" && d.source === "cash" && d.status === "completed" && !d.resolvedBy) {
      console.log(`   $${d.amount}  ${nameOf[d.userId] || d.userId}  "${d.description}"`);
      reverted.add(t.id);
      writes.push(() => t.ref.update({ status: "processing" }));
    }
  }

  console.log("\n3. Balances recomputed from verified movements");
  const verified = {};
  for (const t of txs.docs) {
    const d = t.data();
    // `payment` entries were receipts for money that moved outside the
    // wallet; they never changed a balance and must not change it now.
    if (d.status === "completed" && d.type !== "payment" && !reverted.has(t.id)) {
      verified[d.userId] = cents((verified[d.userId] || 0) + d.amount);
    }
  }
  for (const w of wallets.docs) {
    const current = cents(w.data().balance || 0);
    const next = verified[w.id] || 0;
    if (next < 0) {
      console.log(`   !! ${nameOf[w.id] || w.id}: verified movements sum to $${next} — left untouched, review by hand`);
      continue;
    }
    if (current !== next) {
      console.log(`   ${nameOf[w.id] || w.id}: $${current} → $${next}`);
      writes.push(() => w.ref.update({ balance: next, updatedAt: FieldValue.serverTimestamp() }));
    }
  }

  console.log(`\n${writes.length} change(s) ${APPLY ? "to write" : "would be written"}.`);
  if (APPLY) {
    for (const write of writes) await write();
    console.log("Done.");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("\nUnexpected error:", err.message);
  process.exit(1);
});
