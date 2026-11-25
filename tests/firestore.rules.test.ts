/**
 * Security-rule tests for Firestore.
 *
 * Every `it` named "blocks …" reproduces a concrete attack from the security
 * audit and asserts it is rejected. The "allows …" cases exist so a rule can
 * never be tightened into breaking the app without a test going red.
 *
 * Run with: npm run test:rules
 */
import fs from "node:fs";
import path from "node:path";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { beforeAll, afterAll, beforeEach, describe, it } from "vitest";

const ALICE = "alice";
const BOB = "bob";
const ADMIN = "root";

let testEnv: RulesTestEnvironment;

function db(uid: string) {
  return testEnv.authenticatedContext(uid).firestore();
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "timeless-rules-test",
    firestore: {
      rules: fs.readFileSync(path.resolve("firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  // Seed the user documents that isAdmin() reads.
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const raw = ctx.firestore();
    await setDoc(doc(raw, "users", ALICE), { role: "TALENT", email: "a@x.com" });
    await setDoc(doc(raw, "users", BOB), { role: "CLIENT", email: "b@x.com" });
    await setDoc(doc(raw, "users", ADMIN), { role: "ADMIN", email: "r@x.com" });
  });
});

describe("users — privilege escalation (CRITICAL 1)", () => {
  it("blocks a user promoting themselves via isSuperUser", async () => {
    await assertFails(
      updateDoc(doc(db(ALICE), "users", ALICE), { isSuperUser: true })
    );
  });

  it("blocks a user promoting themselves via role", async () => {
    await assertFails(
      updateDoc(doc(db(ALICE), "users", ALICE), { role: "ADMIN" })
    );
  });

  it("blocks registering straight into an ADMIN role", async () => {
    await assertFails(
      setDoc(doc(db("newcomer"), "users", "newcomer"), {
        role: "ADMIN",
        email: "n@x.com",
      })
    );
  });

  it("blocks reading another user's document", async () => {
    await assertFails(getDoc(doc(db(BOB), "users", ALICE)));
  });

  it("allows a user to edit their own non-privileged fields", async () => {
    await assertSucceeds(
      updateDoc(doc(db(ALICE), "users", ALICE), { email: "new@x.com" })
    );
  });

  it("allows an admin to promote someone", async () => {
    await assertSucceeds(
      updateDoc(doc(db(ADMIN), "users", ALICE), { isSuperUser: true })
    );
  });
});

describe("ownership binding on create (HIGH 4)", () => {
  it("blocks creating an event attributed to another user", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "events", "e1"), { organizerId: BOB, title: "Fake" })
    );
  });

  it("blocks creating a service attributed to another user", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "services", "s1"), { userId: BOB, name: "Fake" })
    );
  });

  it("blocks creating a ticket for another user", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "tickets", "t1"), { userId: BOB, eventId: "e1" })
    );
  });

  it("blocks creating a booking for another user", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "bookings", "b1"), { userId: BOB, title: "Slot" })
    );
  });

  it("blocks claiming another user's venue document", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "venues", BOB), { userId: BOB, venueName: "Fake" })
    );
  });

  it("blocks reassigning an event to another organizer", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events", "e2"), { organizerId: ALICE });
    });
    await assertFails(
      updateDoc(doc(db(ALICE), "events", "e2"), { organizerId: BOB })
    );
  });

  it("allows creating an event you organize", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "events", "e3"), { organizerId: ALICE, title: "Real" })
    );
  });
});

describe("approvals — self-approval", () => {
  it("blocks submitting a verification request already approved", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "approvals", "a1"), {
        userId: ALICE,
        status: "approved",
      })
    );
  });

  it("blocks submitting a request on behalf of another user", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "approvals", "a2"), { userId: BOB, status: "pending" })
    );
  });

  it("allows a pending request for yourself", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "approvals", "a3"), { userId: ALICE, status: "pending" })
    );
  });
});

describe("conversations", () => {
  it("blocks creating a thread you are not part of", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "conversations", "c1"), { participants: [BOB, ADMIN] })
    );
  });

  it("blocks adding yourself to someone else's thread", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "conversations", "c2"), {
        participants: [BOB, ADMIN],
      });
    });
    await assertFails(
      updateDoc(doc(db(ALICE), "conversations", "c2"), {
        participants: [BOB, ADMIN, ALICE],
      })
    );
  });
});

describe("contracts — legacy, read-only since the hiring flow", () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "contracts", "k1"), {
        clientId: BOB,
        talentId: ALICE,
        amount: 1000,
        escrowFee: 50,
        total: 1050,
        status: "pending",
      });
    });
  });

  it("blocks the talent raising the amount after signing", async () => {
    await assertFails(
      updateDoc(doc(db(ALICE), "contracts", "k1"), { amount: 99999 })
    );
  });

  it("blocks the talent forging the client's signature", async () => {
    await assertFails(
      updateDoc(doc(db(ALICE), "contracts", "k1"), {
        clientSignedAt: "2026-08-05T00:00:00Z",
      })
    );
  });

  it("blocks the client marking the talent payout as recorded", async () => {
    await assertFails(
      updateDoc(doc(db(BOB), "contracts", "k1"), { talentPayoutRecorded: true })
    );
  });

  it("allows a party to still read their legacy contract", async () => {
    await assertSucceeds(getDoc(doc(db(ALICE), "contracts", "k1")));
  });

  it("blocks creating a new contract", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "contracts", "k2"), { clientId: BOB, talentId: ALICE, amount: 1 })
    );
  });

  it("blocks an outsider reading the contract", async () => {
    await assertFails(getDoc(doc(db(ADMIN + "-nobody"), "contracts", "k1")));
  });

  it("blocks signing a legacy contract", async () => {
    await assertFails(
      updateDoc(doc(db(ALICE), "contracts", "k1"), {
        talentSignedAt: "2026-08-05T00:00:00Z",
        status: "fully_signed",
      })
    );
  });

  it("blocks recording a payment on a legacy contract", async () => {
    await assertFails(
      updateDoc(doc(db(BOB), "contracts", "k1"), {
        paymentStatus: "paid",
        paymentProvider: "skrill",
        paidAt: "2026-08-05T00:00:00Z",
      })
    );
  });
});

describe("reviews — rating manipulation", () => {
  it("blocks reviewing yourself", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "reviews", "r1"), {
        clientId: ALICE,
        talentId: ALICE,
        rating: 5,
      })
    );
  });

  it("blocks an out-of-range rating", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "reviews", "r2"), {
        clientId: ALICE,
        talentId: BOB,
        rating: 99,
      })
    );
  });

  it("blocks posting a review under someone else's name", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "reviews", "r3"), {
        clientId: BOB,
        talentId: ADMIN,
        rating: 1,
      })
    );
  });

  it("blocks a review that is not tied to a completed hiring", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "reviews", "r4"), {
        clientId: ALICE,
        talentId: BOB,
        rating: 5,
        comment: "Great",
      })
    );
  });
});

describe("private collections", () => {
  it("blocks reading another user's payout method", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "payoutMethods", ALICE), { iban: "ES00" });
    });
    await assertFails(getDoc(doc(db(BOB), "payoutMethods", ALICE)));
  });

  it("blocks reading another user's wallet", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "wallets", ALICE), { balance: 500 });
    });
    await assertFails(getDoc(doc(db(BOB), "wallets", ALICE)));
  });

  it("blocks reading another user's project", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "projects", "p1"), { userId: ALICE });
    });
    await assertFails(getDoc(doc(db(BOB), "projects", "p1")));
  });

  it("blocks writing an audit log as a normal user", async () => {
    await assertFails(setDoc(doc(db(ALICE), "auditLogs", "l1"), { action: "x" }));
  });

  it("blocks notifying another user", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "notifications", "n1"), { userId: BOB, text: "spam" })
    );
  });

  it("blocks deleting an unrelated collection's document", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "categories", "cat1"), { name: "DJ" });
    });
    await assertFails(deleteDoc(doc(db(ALICE), "categories", "cat1")));
  });
});

describe("wallet — the balance belongs to admins (S1)", () => {
  const request = (over: Record<string, unknown> = {}) => ({
    userId: ALICE,
    type: "deposit",
    amount: 50,
    source: "cash",
    status: "processing",
    ...over,
  });

  async function seedWallet(balance: number) {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "wallets", ALICE), { userId: ALICE, balance, escrow: 0 });
    });
  }

  it("blocks a user setting their own balance", async () => {
    await seedWallet(10);
    await assertFails(updateDoc(doc(db(ALICE), "wallets", ALICE), { balance: 9999 }));
  });

  it("blocks creating a wallet that already holds money", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "wallets", ALICE), { userId: ALICE, balance: 500, escrow: 0 })
    );
  });

  it("allows creating an empty wallet", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "wallets", ALICE), { userId: ALICE, balance: 0, escrow: 0 })
    );
  });

  it("blocks a deposit born as completed", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "transactions", "t1"), request({ status: "completed" }))
    );
  });

  it("blocks a user writing a payout or refund to themselves", async () => {
    await assertFails(setDoc(doc(db(ALICE), "transactions", "t1"), request({ type: "payout" })));
    await assertFails(setDoc(doc(db(ALICE), "transactions", "t2"), request({ type: "refund" })));
  });

  it("blocks a negative deposit and a positive withdrawal", async () => {
    await assertFails(setDoc(doc(db(ALICE), "transactions", "t1"), request({ amount: -50 })));
    await assertFails(
      setDoc(doc(db(ALICE), "transactions", "t2"), request({ type: "withdrawal", amount: 50 }))
    );
  });

  it("blocks a request attributed to another user", async () => {
    await assertFails(setDoc(doc(db(ALICE), "transactions", "t1"), request({ userId: BOB })));
  });

  it("blocks a user marking their own request as verified", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "transactions", "t1"), request());
    });
    await assertFails(updateDoc(doc(db(ALICE), "transactions", "t1"), { status: "completed" }));
  });

  it("blocks a withdrawal with no payout method on file", async () => {
    await assertFails(
      setDoc(doc(db(ALICE), "transactions", "t1"), request({ type: "withdrawal", amount: -20, source: "manual_transfer" }))
    );
  });

  it("allows a deposit request, and a withdrawal once a payout method exists", async () => {
    await assertSucceeds(setDoc(doc(db(ALICE), "transactions", "t1"), request()));
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "payoutMethods", ALICE), { bank: { bankName: "X" } });
    });
    await assertSucceeds(
      setDoc(doc(db(ALICE), "transactions", "t2"), request({ type: "withdrawal", amount: -20, source: "manual_transfer" }))
    );
  });

  it("allows an admin to verify a request and credit the balance", async () => {
    await seedWallet(0);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "transactions", "t1"), request());
    });
    await assertSucceeds(updateDoc(doc(db(ADMIN), "transactions", "t1"), { status: "completed" }));
    await assertSucceeds(updateDoc(doc(db(ADMIN), "wallets", ALICE), { balance: 50 }));
  });
});

describe("users — account approval is granted by admins", () => {
  it("blocks a user approving their own account", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", "carol"), { role: "TALENT", status: "Pending" });
    });
    await assertFails(updateDoc(doc(db("carol"), "users", "carol"), { status: "Active" }));
  });

  it("blocks registering already active", async () => {
    await assertFails(setDoc(doc(db("dave"), "users", "dave"), { role: "TALENT", status: "Active" }));
  });

  it("allows registering as pending and editing the profile afterwards", async () => {
    await assertSucceeds(setDoc(doc(db("dave"), "users", "dave"), { role: "TALENT", status: "Pending" }));
    await assertSucceeds(updateDoc(doc(db("dave"), "users", "dave"), { name: "Dave" }));
  });

  it("allows an admin to approve an account", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", "carol"), { role: "TALENT", status: "Pending" });
    });
    await assertSucceeds(updateDoc(doc(db(ADMIN), "users", "carol"), { status: "Active" }));
  });
});

describe("talents — listing and badge are granted by admins", () => {
  it("blocks registering already approved or verified", async () => {
    await assertFails(setDoc(doc(db(ALICE), "talents", ALICE), { userId: ALICE, isApproved: true }));
    await assertFails(setDoc(doc(db(ALICE), "talents", ALICE), { userId: ALICE, isVerified: true }));
  });

  it("blocks a talent approving or verifying themselves", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "talents", ALICE), { userId: ALICE, isApproved: false, isVerified: false });
    });
    await assertFails(updateDoc(doc(db(ALICE), "talents", ALICE), { isApproved: true }));
    await assertFails(updateDoc(doc(db(ALICE), "talents", ALICE), { isVerified: true }));
  });

  it("allows a talent to edit their profile and an admin to approve it", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "talents", ALICE), { userId: ALICE, isApproved: false, isVerified: false })
    );
    await assertSucceeds(updateDoc(doc(db(ALICE), "talents", ALICE), { bio: "DJ in Quito" }));
    await assertSucceeds(updateDoc(doc(db(ADMIN), "talents", ALICE), { isApproved: true }));
  });
});

describe("notifications — admins may notify a user", () => {
  it("allows an admin to notify another user", async () => {
    await assertSucceeds(
      setDoc(doc(db(ADMIN), "notifications", "n1"), { userId: ALICE, title: "Deposit verified" })
    );
  });
});
