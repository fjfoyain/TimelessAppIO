/**
 * Security-rule tests for the hiring flow (contrataciones).
 *
 * There is no server: these rules are the state machine. "allows …" cases walk
 * the real path; "blocks …" cases are the ways a party could cheat — skip a
 * state, change the price, fake the split, pay themselves, rewrite history.
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
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  type Firestore,
  type WriteBatch,
} from "firebase/firestore";
import { beforeAll, afterAll, beforeEach, describe, it } from "vitest";

const CLIENT = "ana";
const DJ = "luna";
const ADMIN = "root";
const STRANGER = "mallory";
const CID = "h1";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const ago = (ms: number) => Timestamp.fromMillis(Date.now() - ms);
const ahead = (ms: number) => Timestamp.fromMillis(Date.now() + ms);

const DESGLOSE = {
  commissionCents: 4500,
  talentNetCents: 25500,
  depositCents: 7500,
  heldCents: 3000,
  directCents: 22500,
};

let testEnv: RulesTestEnvironment;
const db = (uid: string) => testEnv.authenticatedContext(uid).firestore() as unknown as Firestore;

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
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const raw = ctx.firestore();
    await setDoc(doc(raw, "users", CLIENT), { role: "CLIENT", status: "Active", name: "Ana" });
    await setDoc(doc(raw, "users", DJ), { role: "TALENT", status: "Active", name: "Luna" });
    await setDoc(doc(raw, "users", STRANGER), { role: "CLIENT", status: "Active", name: "Mallory" });
    await setDoc(doc(raw, "users", ADMIN), { role: "ADMIN", status: "Active", name: "Root" });
    await setDoc(doc(raw, "talents", DJ), {
      userId: DJ,
      name: "Luna",
      isApproved: true,
      servicePlans: [{ id: "pro", title: "Full Experience", price: 300 }],
    });
  });
});

// ─── Builders ────────────────────────────────────────────────────

function solicitud(over: Record<string, unknown> = {}) {
  return {
    clientId: CLIENT,
    talentId: DJ,
    parties: [CLIENT, DJ],
    clientName: "Ana",
    talentName: "Luna",
    conversationId: null,
    plan: { id: "pro", title: "Full Experience", index: 0 },
    listCents: 30000,
    commissionPct: 15,
    depositPct: 25,
    event: { at: ahead(30 * DAY), type: "boda", sizeKind: "personas", sizeRange: "hasta100", bucket: "chico" },
    status: "solicitada",
    seq: 1,
    oferta: { amountCents: 30000, by: CLIENT },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...over,
  };
}

function crear(uid: string, data: Record<string, unknown>, transicion: Record<string, unknown> = {}) {
  const fsdb = db(uid);
  const batch = writeBatch(fsdb);
  batch.set(doc(fsdb, "contrataciones", CID), data);
  batch.set(doc(fsdb, "contrataciones", CID, "transiciones", "1"), {
    seq: 1,
    from: null,
    to: "solicitada",
    kind: "solicitud",
    by: uid,
    rol: "cliente",
    at: serverTimestamp(),
    ...transicion,
  });
  return batch.commit();
}

// Puts a hiring straight into a state, as if it had got there legitimately.
async function seed(status: string, over: Record<string, unknown> = {}) {
  const accepted = ["aceptada", "confirmada", "realizada", "liquidada"].includes(status);
  const data = {
    ...solicitud(),
    createdAt: ago(HOUR),
    updatedAt: ago(HOUR),
    status,
    seq: 3,
    ...(accepted ? { agreedCents: 30000, desglose: DESGLOSE } : {}),
    ...over,
  };
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "contrataciones", CID), data);
  });
  return data as { seq: number; status: string };
}

async function seedTx(id: string, data: Record<string, unknown>) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "transactions", id), data);
  });
}

interface StepOptions {
  to: string;
  kind: string;
  rol: string;
  patch?: Record<string, unknown>;
  transicion?: Record<string, unknown>;
  extra?: (batch: WriteBatch, fsdb: Firestore) => void;
  // For attacks on the history itself.
  seq?: number;
  skipTransicion?: boolean;
}

function step(uid: string, current: { seq: number; status: string }, o: StepOptions) {
  const fsdb = db(uid);
  const seq = o.seq ?? current.seq + 1;
  const batch = writeBatch(fsdb);
  batch.update(doc(fsdb, "contrataciones", CID), {
    ...(o.patch ?? {}),
    status: o.to,
    seq,
    updatedAt: serverTimestamp(),
  });
  if (!o.skipTransicion) {
    batch.set(doc(fsdb, "contrataciones", CID, "transiciones", String(seq)), {
      seq,
      from: current.status,
      to: o.to,
      kind: o.kind,
      by: uid,
      rol: o.rol,
      at: serverTimestamp(),
      ...(o.transicion ?? {}),
    });
  }
  o.extra?.(batch, fsdb);
  return batch.commit();
}

function movimiento(tipo: "pago_dj" | "reembolso", cents: number, userId: string, over: Record<string, unknown> = {}) {
  return (batch: WriteBatch, fsdb: Firestore) => {
    batch.set(doc(fsdb, "transactions", `${CID}_${tipo}`), {
      userId,
      contratacionId: CID,
      type: tipo === "pago_dj" ? "payout" : "refund",
      amountCents: cents,
      amount: cents / 100,
      source: "contratacion",
      status: "processing",
      description: "Held deposit",
      createdAt: serverTimestamp(),
      ...over,
    });
  };
}

function anticipo(over: Record<string, unknown> = {}) {
  return {
    userId: CLIENT,
    contratacionId: CID,
    type: "payment",
    amountCents: 7500,
    amount: 75,
    source: "manual_transfer",
    status: "processing",
    reference: "Transfer #4471",
    description: "Deposit — Full Experience",
    createdAt: serverTimestamp(),
    ...over,
  };
}

const reparto = (clienteCents: number, timelessCents: number, djCents: number) => ({
  clienteCents,
  timelessCents,
  djCents,
});

const accept = { to: "aceptada", kind: "aceptacion", patch: { agreedCents: 30000, desglose: DESGLOSE } };
const cancel = (uid: string, rol: string, patch: Record<string, unknown> = {}) => ({
  to: "cancelada",
  kind: "cancelacion",
  rol,
  patch: { cancelacion: { by: uid, rol }, ...patch },
});

// ─── Requesting ──────────────────────────────────────────────────

describe("requesting a hiring", () => {
  it("allows a valid request, with its first history entry", async () => {
    await assertSucceeds(crear(CLIENT, solicitud()));
  });

  it("allows notifying the DJ in the same request", async () => {
    const fsdb = db(CLIENT);
    const batch = writeBatch(fsdb);
    batch.set(doc(fsdb, "contrataciones", CID), solicitud());
    batch.set(doc(fsdb, "contrataciones", CID, "transiciones", "1"), {
      seq: 1, from: null, to: "solicitada", kind: "solicitud", by: CLIENT, rol: "cliente", at: serverTimestamp(),
    });
    batch.set(doc(fsdb, "notifications", `${CID}_1_${DJ}`), {
      userId: DJ, type: "contratacion", contratacionId: CID, seq: 1,
      title: "New booking request", description: "Ana requested Full Experience.",
      isNew: true, createdAt: serverTimestamp(),
    });
    await assertSucceeds(batch.commit());
  });

  it("blocks a list price that is not the plan's price", async () => {
    await assertFails(crear(CLIENT, solicitud({ listCents: 5000, oferta: { amountCents: 5000, by: CLIENT } })));
  });

  it("blocks a lower commission or deposit", async () => {
    await assertFails(crear(CLIENT, solicitud({ commissionPct: 0 })));
    await assertFails(crear(CLIENT, solicitud({ depositPct: 5 })));
  });

  it("blocks a request in someone else's name, or to yourself", async () => {
    await assertFails(crear(STRANGER, solicitud()));
    await assertFails(crear(DJ, solicitud({ clientId: DJ, parties: [DJ, DJ], clientName: "Luna", oferta: { amountCents: 30000, by: DJ } })));
  });

  it("blocks starting beyond the first state", async () => {
    await assertFails(crear(CLIENT, solicitud({ status: "confirmada" }), { to: "confirmada" }));
    await assertFails(crear(CLIENT, { ...solicitud(), agreedCents: 100, desglose: DESGLOSE }));
  });

  it("blocks an event in the past", async () => {
    await assertFails(crear(CLIENT, solicitud({ event: { ...solicitud().event, at: ago(DAY) } })));
  });

  it("blocks declaring a large event as small", async () => {
    await assertFails(crear(CLIENT, solicitud({ event: { ...solicitud().event, sizeRange: "mas300", bucket: "chico" } })));
  });

  it("blocks an offer outside half-to-double the list price, or with cents", async () => {
    await assertFails(crear(CLIENT, solicitud({ oferta: { amountCents: 200000, by: CLIENT } })));
    await assertFails(crear(CLIENT, solicitud({ oferta: { amountCents: 1000, by: CLIENT } })));
    await assertFails(crear(CLIENT, solicitud({ oferta: { amountCents: 30050, by: CLIENT } })));
  });

  it("blocks a client whose account is not approved", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await updateDoc(doc(ctx.firestore(), "users", CLIENT), { status: "Pending" });
    });
    await assertFails(crear(CLIENT, solicitud()));
  });

  it("blocks hiring a talent that is not approved", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await updateDoc(doc(ctx.firestore(), "talents", DJ), { isApproved: false });
    });
    await assertFails(crear(CLIENT, solicitud()));
  });

  it("blocks a request without its history entry", async () => {
    await assertFails(setDoc(doc(db(CLIENT), "contrataciones", CID), solicitud()));
  });

  it("blocks outsiders from reading a hiring or its history", async () => {
    await seed("negociacion");
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "contrataciones", CID, "transiciones", "1"), { seq: 1 });
    });
    await assertFails(getDoc(doc(db(STRANGER), "contrataciones", CID)));
    await assertFails(getDoc(doc(db(STRANGER), "contrataciones", CID, "transiciones", "1")));
    await assertSucceeds(getDoc(doc(db(DJ), "contrataciones", CID)));
    await assertSucceeds(getDoc(doc(db(DJ), "contrataciones", CID, "transiciones", "1")));
  });
});

// ─── Negotiating ─────────────────────────────────────────────────

describe("negotiating", () => {
  const counter = (uid: string, cents: number, rol: string) => ({
    to: "negociacion",
    kind: "oferta",
    rol,
    patch: { oferta: { amountCents: cents, by: uid } },
    transicion: { offerCents: cents },
  });

  it("allows the DJ to counter and the client to accept", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertSucceeds(step(DJ, c, counter(DJ, 28000, "dj")));
    await assertSucceeds(
      step(CLIENT, { seq: 2, status: "negociacion" }, {
        to: "aceptada", kind: "aceptacion", rol: "cliente",
        patch: { agreedCents: 28000, desglose: { commissionCents: 4200, talentNetCents: 23800, depositCents: 7000, heldCents: 2800, directCents: 21000 } },
      })
    );
  });

  it("allows the DJ to accept the request as it stands", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertSucceeds(step(DJ, c, { ...accept, rol: "dj" }));
  });

  it("blocks accepting your own offer", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertFails(step(CLIENT, c, { ...accept, rol: "cliente" }));
  });

  it("blocks two offers in a row from the same side", async () => {
    const c = await seed("negociacion", { oferta: { amountCents: 28000, by: DJ } });
    await assertFails(step(DJ, c, counter(DJ, 40000, "dj")));
  });

  it("blocks agreeing at a price other than the standing offer", async () => {
    const c = await seed("negociacion", { oferta: { amountCents: 28000, by: DJ } });
    await assertFails(step(CLIENT, c, { ...accept, rol: "cliente" }));
  });

  it("blocks a forged breakdown", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertFails(
      step(DJ, c, { ...accept, rol: "dj", patch: { agreedCents: 30000, desglose: { ...DESGLOSE, commissionCents: 0, talentNetCents: 30000, heldCents: 7500 } } })
    );
    await assertFails(
      step(DJ, c, { ...accept, rol: "dj", patch: { agreedCents: 30000, desglose: { ...DESGLOSE, heldCents: 7500 } } })
    );
  });

  it("blocks changing the list price, the event or the parties along the way", async () => {
    const c = await seed("solicitada", { seq: 1 });
    const base = counter(DJ, 28000, "dj");
    await assertFails(step(DJ, c, { ...base, patch: { ...base.patch, listCents: 100000 } }));
    await assertFails(step(DJ, c, { ...base, patch: { ...base.patch, event: { ...solicitud().event, bucket: "grande" } } }));
    await assertFails(step(DJ, c, { ...base, patch: { ...base.patch, clientId: DJ } }));
  });

  it("blocks reopening the price once accepted", async () => {
    const c = await seed("aceptada");
    await assertFails(step(DJ, c, counter(DJ, 60000, "dj")));
    await assertFails(
      step(DJ, c, { to: "aceptada", kind: "aceptacion", rol: "dj", patch: { agreedCents: 60000 } })
    );
  });

  it("blocks acting on a request whose deadline passed", async () => {
    const c = await seed("solicitada", { seq: 1, updatedAt: ago(73 * HOUR) });
    await assertFails(step(DJ, c, { ...accept, rol: "dj" }));
    await assertFails(step(DJ, c, counter(DJ, 28000, "dj")));
  });
});

// ─── History ─────────────────────────────────────────────────────

describe("history", () => {
  it("blocks a step without its history entry", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertFails(step(DJ, c, { ...accept, rol: "dj", skipTransicion: true }));
  });

  it("blocks a history entry without a step", async () => {
    await seed("negociacion");
    await assertFails(
      setDoc(doc(db(DJ), "contrataciones", CID, "transiciones", "4"), {
        seq: 4, from: "negociacion", to: "confirmada", kind: "confirmacion", by: DJ, rol: "dj", at: serverTimestamp(),
      })
    );
  });

  it("blocks skipping or reusing a sequence number", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertFails(step(DJ, c, { ...accept, rol: "dj", seq: 3 }));
    await assertFails(step(DJ, c, { ...accept, rol: "dj", seq: 1 }));
  });

  it("blocks a history entry that lies about where it came from or who wrote it", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertFails(step(DJ, c, { ...accept, rol: "dj", transicion: { from: "negociacion" } }));
    await assertFails(step(DJ, c, { ...accept, rol: "dj", transicion: { by: CLIENT } }));
    await assertFails(step(DJ, c, { ...accept, rol: "cliente" }));
    await assertFails(step(DJ, c, { ...accept, rol: "admin" }));
  });

  it("blocks editing or deleting history, and deleting a hiring", async () => {
    await seed("negociacion");
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "contrataciones", CID, "transiciones", "1"), { seq: 1, to: "solicitada" });
    });
    await assertFails(updateDoc(doc(db(DJ), "contrataciones", CID, "transiciones", "1"), { to: "liquidada" }));
    await assertFails(deleteDoc(doc(db(DJ), "contrataciones", CID, "transiciones", "1")));
    await assertFails(deleteDoc(doc(db(CLIENT), "contrataciones", CID)));
  });
});

// ─── Deposit ─────────────────────────────────────────────────────

describe("the deposit", () => {
  it("allows the client to report it, and only for the exact amount", async () => {
    await seed("aceptada");
    await assertFails(setDoc(doc(db(CLIENT), "transactions", `${CID}_anticipo`), anticipo({ amountCents: 100, amount: 1 })));
    await assertSucceeds(setDoc(doc(db(CLIENT), "transactions", `${CID}_anticipo`), anticipo()));
  });

  it("blocks reporting it already verified, or by someone else", async () => {
    await seed("aceptada");
    await assertFails(setDoc(doc(db(CLIENT), "transactions", `${CID}_anticipo`), anticipo({ status: "completed" })));
    await assertFails(setDoc(doc(db(DJ), "transactions", `${CID}_anticipo`), anticipo({ userId: DJ })));
  });

  it("blocks reporting it before the price is agreed", async () => {
    await seed("negociacion");
    await assertFails(setDoc(doc(db(CLIENT), "transactions", `${CID}_anticipo`), anticipo()));
  });

  it("blocks the client verifying their own deposit", async () => {
    await seed("aceptada");
    await seedTx(`${CID}_anticipo`, { ...anticipo(), createdAt: ago(HOUR) });
    await assertFails(updateDoc(doc(db(CLIENT), "transactions", `${CID}_anticipo`), { status: "completed" }));
  });

  it("blocks a party confirming the hiring themselves", async () => {
    const c = await seed("aceptada");
    await seedTx(`${CID}_anticipo`, { ...anticipo(), status: "completed", createdAt: ago(HOUR) });
    await assertFails(step(CLIENT, c, { to: "confirmada", kind: "confirmacion", rol: "cliente" }));
    await assertFails(step(DJ, c, { to: "confirmada", kind: "confirmacion", rol: "dj" }));
  });

  it("allows an admin to verify it and confirm the hiring in one request", async () => {
    const c = await seed("aceptada");
    await seedTx(`${CID}_anticipo`, { ...anticipo(), createdAt: ago(HOUR) });
    await assertSucceeds(
      step(ADMIN, c, {
        to: "confirmada", kind: "confirmacion", rol: "admin",
        extra: (batch, fsdb) => {
          batch.update(doc(fsdb, "transactions", `${CID}_anticipo`), { status: "completed", resolvedBy: ADMIN, resolvedAt: serverTimestamp() });
          batch.set(doc(fsdb, "auditLogs", "a1"), { action: "Deposit verified", userName: "Root" });
        },
      })
    );
  });

  it("blocks an admin confirming without a verified deposit", async () => {
    const c = await seed("aceptada");
    await seedTx(`${CID}_anticipo`, { ...anticipo(), createdAt: ago(HOUR) });
    await assertFails(step(ADMIN, c, { to: "confirmada", kind: "confirmacion", rol: "admin" }));
  });

  it("allows the client to report it again after a rejection", async () => {
    await seed("aceptada");
    await seedTx(`${CID}_anticipo`, { ...anticipo(), status: "rejected", createdAt: ago(HOUR) });
    await assertSucceeds(
      updateDoc(doc(db(CLIENT), "transactions", `${CID}_anticipo`), {
        status: "processing", reference: "Transfer #4480", createdAt: serverTimestamp(),
      })
    );
  });

  it("a reported deposit stops the clock: no expiring, no cancelling", async () => {
    const c = await seed("aceptada", { updatedAt: ago(80 * HOUR) });
    await seedTx(`${CID}_anticipo`, { ...anticipo(), createdAt: ago(79 * HOUR) });
    await assertFails(step(DJ, c, { to: "expirada", kind: "expiracion", rol: "dj" }));
    await assertFails(step(DJ, c, cancel(DJ, "dj")));
  });
});

// ─── Deadlines ───────────────────────────────────────────────────

describe("deadlines", () => {
  it("blocks expiring a request at 71 hours and allows it at 73", async () => {
    let c = await seed("solicitada", { seq: 1, updatedAt: ago(71 * HOUR) });
    await assertFails(step(CLIENT, c, { to: "expirada", kind: "expiracion", rol: "cliente" }));
    c = await seed("solicitada", { seq: 1, updatedAt: ago(73 * HOUR) });
    await assertSucceeds(step(CLIENT, c, { to: "expirada", kind: "expiracion", rol: "cliente" }));
  });

  it("gives a large event more time to negotiate than a small one", async () => {
    const large = { ...solicitud().event, sizeRange: "mas300", bucket: "grande", at: ahead(200 * DAY) };
    let c = await seed("negociacion", { updatedAt: ago(8 * DAY), event: large });
    await assertFails(step(DJ, c, { to: "expirada", kind: "expiracion", rol: "dj" }));
    c = await seed("negociacion", { updatedAt: ago(8 * DAY) });
    await assertSucceeds(step(DJ, c, { to: "expirada", kind: "expiracion", rol: "dj" }));
  });

  it("blocks expiring a confirmed hiring", async () => {
    const c = await seed("confirmada", { updatedAt: ago(400 * DAY) });
    await assertFails(step(DJ, c, { to: "expirada", kind: "expiracion", rol: "dj" }));
  });
});

// ─── Cancelling ──────────────────────────────────────────────────

describe("cancelling", () => {
  it("allows the client to withdraw a request under negotiation", async () => {
    const c = await seed("negociacion");
    await assertSucceeds(step(CLIENT, c, cancel(CLIENT, "cliente")));
  });

  it("allows the DJ to decline a new request", async () => {
    const c = await seed("solicitada", { seq: 1 });
    await assertSucceeds(step(DJ, c, cancel(DJ, "dj")));
  });

  it("allows the DJ to walk away after agreeing, before the deposit", async () => {
    const c = await seed("aceptada");
    await assertSucceeds(step(DJ, c, cancel(DJ, "dj")));
  });

  it("allows the client to walk away after agreeing, before the deposit", async () => {
    const c = await seed("aceptada");
    await assertSucceeds(step(CLIENT, c, cancel(CLIENT, "cliente")));
  });

  it("allows expiring an agreed hiring whose deposit never came", async () => {
    const c = await seed("aceptada", { updatedAt: ago(73 * HOUR) });
    await assertSucceeds(step(DJ, c, { to: "expirada", kind: "expiracion", rol: "dj" }));
  });

  it("client, more than 7 days ahead: recovers the held $30", async () => {
    const c = await seed("confirmada");
    await assertSucceeds(
      step(CLIENT, c, { ...cancel(CLIENT, "cliente", { reparto: reparto(3000, 4500, 0) }), extra: movimiento("reembolso", 3000, CLIENT) })
    );
  });

  it("client, 7 days or less: no refund, the DJ is owed the held $30", async () => {
    const c = await seed("confirmada", { event: { ...solicitud().event, at: ahead(6 * DAY) } });
    await assertFails(
      step(CLIENT, c, { ...cancel(CLIENT, "cliente", { reparto: reparto(3000, 4500, 0) }), extra: movimiento("reembolso", 3000, CLIENT) })
    );
    await assertSucceeds(
      step(CLIENT, c, { ...cancel(CLIENT, "cliente", { reparto: reparto(0, 4500, 3000) }), extra: movimiento("pago_dj", 3000, DJ) })
    );
  });

  it("DJ cancels: the client is owed the whole $75", async () => {
    const c = await seed("confirmada");
    await assertSucceeds(
      step(DJ, c, { ...cancel(DJ, "dj", { reparto: reparto(7500, 0, 0) }), extra: movimiento("reembolso", 7500, CLIENT) })
    );
  });

  it("blocks the client claiming the full refund that only a DJ cancellation gives", async () => {
    const c = await seed("confirmada");
    await assertFails(
      step(CLIENT, c, { ...cancel(CLIENT, "cliente", { reparto: reparto(7500, 0, 0) }), extra: movimiento("reembolso", 7500, CLIENT) })
    );
    await assertFails(
      step(CLIENT, c, { ...cancel(CLIENT, "dj", { reparto: reparto(7500, 0, 0) }), extra: movimiento("reembolso", 7500, CLIENT) })
    );
  });

  it("blocks a late-cancelling DJ keeping the deposit", async () => {
    const c = await seed("confirmada", { event: { ...solicitud().event, at: ahead(2 * DAY) } });
    await assertFails(
      step(DJ, c, { ...cancel(DJ, "dj", { reparto: reparto(0, 4500, 3000) }), extra: movimiento("pago_dj", 3000, DJ) })
    );
  });

  it("blocks cancelling a confirmed hiring without recording what is owed", async () => {
    const c = await seed("confirmada");
    await assertFails(step(CLIENT, c, cancel(CLIENT, "cliente", { reparto: reparto(3000, 4500, 0) })));
  });

  it("blocks cancelling once the event has started", async () => {
    const c = await seed("confirmada", { event: { ...solicitud().event, at: ago(HOUR) } });
    await assertFails(
      step(DJ, c, { ...cancel(DJ, "dj", { reparto: reparto(7500, 0, 0) }), extra: movimiento("reembolso", 7500, CLIENT) })
    );
  });
});

// ─── Completing and settling ─────────────────────────────────────

describe("completing and settling", () => {
  const done = (rol: string) => ({ to: "realizada", kind: "realizacion", rol, patch: { reparto: reparto(0, 4500, 3000) } });
  const after = (ms: number) => ({ event: { ...solicitud().event, at: ago(ms) } });

  it("allows the client to confirm the service after the event", async () => {
    const c = await seed("confirmada", after(DAY));
    await assertSucceeds(step(CLIENT, c, { ...done("cliente"), extra: movimiento("pago_dj", 3000, DJ) }));
  });

  it("blocks confirming before the event", async () => {
    const c = await seed("confirmada");
    await assertFails(step(CLIENT, c, { ...done("cliente"), extra: movimiento("pago_dj", 3000, DJ) }));
  });

  it("blocks the DJ confirming their own service until 7 days have passed", async () => {
    let c = await seed("confirmada", after(DAY));
    await assertFails(step(DJ, c, { ...done("dj"), extra: movimiento("pago_dj", 3000, DJ) }));
    c = await seed("confirmada", after(8 * DAY));
    await assertSucceeds(step(DJ, c, { ...done("dj"), extra: movimiento("pago_dj", 3000, DJ) }));
  });

  it("an open dispute blocks completion, even after 7 days", async () => {
    const c = await seed("confirmada", { ...after(8 * DAY), disputa: { abierta: true, by: CLIENT, at: ago(6 * DAY), motivo: "No show" } });
    await assertFails(step(DJ, c, { ...done("dj"), extra: movimiento("pago_dj", 3000, DJ) }));
  });

  it("allows a party to open a dispute within 7 days of the event, once", async () => {
    const c = await seed("confirmada", after(DAY));
    const dispute = { to: "confirmada", kind: "disputa", rol: "cliente", patch: { disputa: { abierta: true, by: CLIENT, at: serverTimestamp(), motivo: "The DJ did not show up" } } };
    await assertSucceeds(step(CLIENT, c, dispute));
    await assertFails(step(DJ, { seq: 4, status: "confirmada" }, { ...dispute, rol: "dj", patch: { disputa: { abierta: true, by: DJ, at: serverTimestamp(), motivo: "again" } } }));
  });

  it("blocks the DJ being owed more than the held part", async () => {
    const c = await seed("confirmada", after(8 * DAY));
    await assertFails(
      step(DJ, c, { to: "realizada", kind: "realizacion", rol: "dj", patch: { reparto: reparto(0, 0, 7500) }, extra: movimiento("pago_dj", 7500, DJ) })
    );
    await assertFails(step(DJ, c, { ...done("dj"), extra: movimiento("pago_dj", 7500, DJ) }));
  });

  it("blocks a movement already marked as paid, or paid to the wrong person", async () => {
    const c = await seed("confirmada", after(8 * DAY));
    await assertFails(step(DJ, c, { ...done("dj"), extra: movimiento("pago_dj", 3000, DJ, { status: "completed" }) }));
    await assertFails(step(DJ, c, { ...done("dj"), extra: movimiento("pago_dj", 3000, STRANGER) }));
  });

  it("blocks a party settling the hiring or crediting a wallet", async () => {
    const c = await seed("realizada", { reparto: reparto(0, 4500, 3000) });
    await seedTx(`${CID}_pago_dj`, { userId: DJ, contratacionId: CID, type: "payout", amountCents: 3000, amount: 30, status: "processing" });
    await assertFails(step(DJ, c, { to: "liquidada", kind: "liquidacion", rol: "dj" }));
    await assertFails(updateDoc(doc(db(DJ), "transactions", `${CID}_pago_dj`), { status: "completed" }));
    await assertFails(setDoc(doc(db(DJ), "wallets", DJ), { userId: DJ, balance: 30, escrow: 0 }));
  });

  it("allows an admin to release the held deposit and settle, in one request", async () => {
    const c = await seed("realizada", { reparto: reparto(0, 4500, 3000) });
    await seedTx(`${CID}_pago_dj`, { userId: DJ, contratacionId: CID, type: "payout", amountCents: 3000, amount: 30, status: "processing" });
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "wallets", DJ), { userId: DJ, balance: 0, escrow: 0 });
    });
    await assertSucceeds(
      step(ADMIN, c, {
        to: "liquidada", kind: "liquidacion", rol: "admin",
        extra: (batch, fsdb) => {
          batch.update(doc(fsdb, "transactions", `${CID}_pago_dj`), { status: "completed", resolvedBy: ADMIN, resolvedAt: serverTimestamp() });
          batch.update(doc(fsdb, "wallets", DJ), { balance: 30, updatedAt: serverTimestamp() });
          batch.set(doc(fsdb, "transactions", `${CID}_comision`), { userId: "timeless", contratacionId: CID, type: "commission", amountCents: 4500, amount: 45, status: "completed" });
          batch.set(doc(fsdb, "auditLogs", "a1"), { action: "Held deposit released", userName: "Root" });
        },
      })
    );
  });

  it("blocks an admin settling while the payout is still pending", async () => {
    const c = await seed("realizada", { reparto: reparto(0, 4500, 3000) });
    await seedTx(`${CID}_pago_dj`, { userId: DJ, contratacionId: CID, type: "payout", amountCents: 3000, amount: 30, status: "processing" });
    await assertFails(step(ADMIN, c, { to: "liquidada", kind: "liquidacion", rol: "admin" }));
  });

  it("allows an admin to resolve a dispute with a split that adds up to the deposit", async () => {
    const c = await seed("confirmada", { ...after(2 * DAY), disputa: { abierta: true, by: CLIENT, at: ago(DAY), motivo: "Left early" } });
    const resolve = (r: ReturnType<typeof reparto>) => ({
      to: "cancelada", kind: "cancelacion", rol: "admin",
      patch: { cancelacion: { by: ADMIN, rol: "admin" }, reparto: r, disputa: { abierta: false, by: CLIENT, at: ago(DAY), motivo: "Left early" } },
    });
    await assertFails(step(ADMIN, c, { ...resolve(reparto(5000, 4500, 3000)), extra: movimiento("reembolso", 5000, CLIENT) }));
    await assertSucceeds(
      step(ADMIN, c, {
        ...resolve(reparto(1500, 4500, 1500)),
        extra: (batch, fsdb) => {
          movimiento("reembolso", 1500, CLIENT)(batch, fsdb);
          movimiento("pago_dj", 1500, DJ)(batch, fsdb);
        },
      })
    );
  });
});

// ─── Money and messages outside a step ───────────────────────────

describe("movements and notifications outside a real step", () => {
  it("blocks paying yourself without a step", async () => {
    await seed("confirmada", { reparto: reparto(0, 4500, 3000) });
    await assertFails(
      setDoc(doc(db(DJ), "transactions", `${CID}_pago_dj`), {
        userId: DJ, contratacionId: CID, type: "payout", amountCents: 3000, amount: 30,
        source: "contratacion", status: "processing", description: "x", createdAt: serverTimestamp(),
      })
    );
  });

  it("blocks a payout or refund under any other id", async () => {
    await assertFails(
      setDoc(doc(db(DJ), "transactions", "anything"), {
        userId: DJ, type: "payout", amount: 30, amountCents: 3000, source: "manual_transfer", status: "processing",
      })
    );
    await assertFails(
      setDoc(doc(db(DJ), "transactions", "anything2"), {
        userId: DJ, contratacionId: CID, type: "deposit", amount: 30, source: "cash", status: "processing",
      })
    );
  });

  it("blocks notifying the other party without a step, or a non-party", async () => {
    await seed("negociacion");
    const notif = (userId: string, seq: number) => ({
      userId, type: "contratacion", contratacionId: CID, seq,
      title: "Hi", description: "spam", isNew: true, createdAt: serverTimestamp(),
    });
    await assertFails(setDoc(doc(db(CLIENT), "notifications", `${CID}_3_${DJ}`), notif(DJ, 3)));
    await assertFails(setDoc(doc(db(STRANGER), "notifications", `${CID}_3_${DJ}`), notif(DJ, 3)));
    await assertFails(setDoc(doc(db(CLIENT), "notifications", "n1"), { userId: DJ, type: "payment", title: "x" }));
  });

  it("blocks handing your own notification to someone else", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "notifications", "n1"), { userId: CLIENT, title: "Mine", isNew: true });
    });
    await assertFails(updateDoc(doc(db(CLIENT), "notifications", "n1"), { userId: DJ, title: "You won" }));
    await assertSucceeds(updateDoc(doc(db(CLIENT), "notifications", "n1"), { isNew: false }));
  });
});

// ─── What the hiring flow replaced ───────────────────────────────

describe("what the hiring flow replaced", () => {
  it("blocks writing a price offer into a conversation", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "conversations", "c1"), { participants: [CLIENT, DJ], lastMessage: "" });
    });
    await assertFails(
      updateDoc(doc(db(DJ), "conversations", "c1"), { negotiation: { currentOffer: 99999, status: "agreed", acceptedBy: [CLIENT, DJ] } })
    );
    await assertSucceeds(updateDoc(doc(db(DJ), "conversations", "c1"), { lastMessage: "hola", lastMessageTime: serverTimestamp() }));
  });

  it("blocks reviewing a talent without a completed hiring", async () => {
    const review = { clientId: CLIENT, talentId: DJ, clientName: "Ana", rating: 5, comment: "Great" };
    await assertFails(setDoc(doc(db(CLIENT), "reviews", "r1"), review));
    await seed("confirmada");
    await assertFails(setDoc(doc(db(CLIENT), "reviews", CID), review));
  });

  it("allows one review per completed hiring, by its client", async () => {
    await seed("realizada", { reparto: reparto(0, 4500, 3000) });
    const review = { clientId: CLIENT, talentId: DJ, clientName: "Ana", rating: 5, comment: "Great" };
    await assertFails(setDoc(doc(db(STRANGER), "reviews", CID), { ...review, clientId: STRANGER }));
    await assertSucceeds(setDoc(doc(db(CLIENT), "reviews", CID), review));
  });
});
