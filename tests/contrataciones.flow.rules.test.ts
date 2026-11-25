/**
 * End-to-end tests of the hiring flow: the app's own data layer
 * (src/lib/contrataciones.ts) running against the real security rules.
 *
 * The rule tests prove the rules reject cheating; these prove the code the app
 * actually ships is accepted by them — that both sides agree on every field.
 *
 * Run with: npm run test:rules
 */
import fs from "node:fs";
import path from "node:path";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, Timestamp, type Firestore } from "firebase/firestore";
import { beforeAll, afterAll, beforeEach, describe, it, expect, vi } from "vitest";

// The data layer imports `db` from src/lib/firebase. Here it is whichever
// emulator session is currently "signed in".
const session: { db: Firestore | null } = { db: null };
vi.mock("@/lib/firebase", () => ({
  get db() {
    return session.db;
  },
}));

import {
  ejecutar,
  liquidarMovimiento,
  reportarAnticipo,
  rechazarAnticipo,
  resenar,
  resolverDisputa,
  solicitar,
  verificarAnticipo,
  expirarComoAdmin,
} from "@/lib/contrataciones";
import { resolveTransaction } from "@/lib/firestore";
import type { Contratacion } from "@/lib/contratacion";

const CLIENT = "ana";
const DJ = "luna";
const ADMIN = "root";
const actor = { id: ADMIN, name: "Root" };
const DAY = 86_400_000;
const PLAN = { id: "pro", title: "Full Experience", description: "", price: 300, includes: [] };

let testEnv: RulesTestEnvironment;
const as = (uid: string) => {
  session.db = testEnv.authenticatedContext(uid).firestore() as unknown as Firestore;
};

async function raw<T>(fn: (fsdb: Firestore) => Promise<T>): Promise<T> {
  let out: T;
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    out = await fn(ctx.firestore() as unknown as Firestore);
  });
  return out!;
}

const hiring = (cid: string) =>
  raw(async (fsdb) => (await getDoc(doc(fsdb, "contrataciones", cid))).data() as Record<string, unknown>);
const balance = (uid: string) =>
  raw(async (fsdb) => ((await getDoc(doc(fsdb, "wallets", uid))).data()?.balance as number | undefined) ?? 0);
const movement = (id: string) =>
  raw(async (fsdb) => (await getDoc(doc(fsdb, "transactions", id))).data() as Record<string, unknown> | undefined);

// The app reads a hiring through its subscription; for the test, rebuild the
// same shape from the stored document.
async function load(cid: string): Promise<Contratacion> {
  const d = await hiring(cid);
  const ms = (v: unknown) => (v as Timestamp).toMillis();
  return {
    ...(d as unknown as Contratacion),
    id: cid,
    event: { ...(d.event as Contratacion["event"]), at: ms((d.event as { at: unknown }).at) },
    createdAt: ms(d.createdAt),
    updatedAt: ms(d.updatedAt),
  };
}

// The event has to be in the future to request and confirm, and in the past to
// complete. Nobody can wait a month in a test, so the clock is moved by hand.
const moveEvent = (cid: string, offsetMs: number) =>
  raw((fsdb) => updateDoc(doc(fsdb, "contrataciones", cid), { "event.at": Timestamp.fromMillis(Date.now() + offsetMs) }));

async function request(offerCents = 30000): Promise<string> {
  as(CLIENT);
  return solicitar({
    client: { id: CLIENT, name: "Ana" },
    talent: { id: DJ, name: "Luna" },
    plan: PLAN,
    planIndex: 0,
    event: { at: new Date(Date.now() + 30 * DAY), type: "boda", sizeKind: "personas", sizeRange: "hasta100", place: "EC" },
    offerCents,
    conversationId: null,
  });
}

async function confirmed(): Promise<string> {
  const cid = await request();
  as(DJ);
  await ejecutar(cid, "aceptar", DJ);
  as(CLIENT);
  await reportarAnticipo(await load(cid), CLIENT, { source: "manual_transfer", reference: "Transfer #4471" });
  as(ADMIN);
  await verificarAnticipo(cid, actor);
  return cid;
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
  await raw(async (fsdb) => {
    await setDoc(doc(fsdb, "users", CLIENT), { role: "CLIENT", status: "Active", name: "Ana" });
    await setDoc(doc(fsdb, "users", DJ), { role: "TALENT", status: "Active", name: "Luna" });
    await setDoc(doc(fsdb, "users", ADMIN), { role: "ADMIN", status: "Active", name: "Root" });
    await setDoc(doc(fsdb, "talents", DJ), { userId: DJ, name: "Luna", isApproved: true, servicePlans: [PLAN] });
  });
});

describe("the whole flow, through the app's own code", () => {
  it("request → counter → accept → deposit → confirmed → completed → settled", async () => {
    const cid = await request(26000);
    expect((await hiring(cid)).status).toBe("solicitada");

    as(DJ);
    await ejecutar(cid, "contraofertar", DJ, { amountCents: 30000 });
    expect((await hiring(cid)).status).toBe("negociacion");

    as(CLIENT);
    await ejecutar(cid, "aceptar", CLIENT);
    const accepted = await hiring(cid);
    expect(accepted.status).toBe("aceptada");
    expect(accepted.agreedCents).toBe(30000);
    expect(accepted.desglose).toEqual({
      commissionCents: 4500, talentNetCents: 25500, depositCents: 7500, heldCents: 3000, directCents: 22500,
    });

    await reportarAnticipo(await load(cid), CLIENT, { source: "manual_transfer", reference: "Transfer #4471" });
    expect((await movement(`${cid}_anticipo`))?.status).toBe("processing");
    expect((await hiring(cid)).status).toBe("aceptada");

    as(ADMIN);
    await verificarAnticipo(cid, actor);
    expect((await hiring(cid)).status).toBe("confirmada");
    expect((await movement(`${cid}_anticipo`))?.status).toBe("completed");
    // The deposit arrived outside the platform: nobody's wallet moves.
    expect(await balance(CLIENT)).toBe(0);

    await moveEvent(cid, -DAY);
    as(CLIENT);
    await ejecutar(cid, "confirmar_realizada", CLIENT);
    expect((await hiring(cid)).status).toBe("realizada");
    expect(await movement(`${cid}_pago_dj`)).toMatchObject({ status: "processing", amountCents: 3000, userId: DJ });
    expect(await balance(DJ)).toBe(0);

    as(ADMIN);
    await liquidarMovimiento(cid, "pago_dj", actor);
    const settled = await hiring(cid);
    expect(settled.status).toBe("liquidada");
    expect(settled.reparto).toEqual({ clienteCents: 0, timelessCents: 4500, djCents: 3000 });
    expect(await balance(DJ)).toBe(30);
    expect(await movement(`${cid}_comision`)).toMatchObject({ status: "completed", amountCents: 4500, type: "commission" });

    // Paying twice is impossible.
    await expect(liquidarMovimiento(cid, "pago_dj", actor)).rejects.toThrow();
    expect(await balance(DJ)).toBe(30);

    // Every step left its record, in order, and the other party was told.
    const history = await raw(async (fsdb) =>
      (await getDocs(collection(fsdb, "contrataciones", cid, "transiciones"))).docs
        .map((d) => d.data())
        .sort((a, b) => a.seq - b.seq)
        .map((t) => `${t.seq}:${t.kind}:${t.rol}`)
    );
    expect(history).toEqual([
      "1:solicitud:cliente", "2:oferta:dj", "3:aceptacion:cliente",
      "4:confirmacion:admin", "5:realizacion:cliente", "6:liquidacion:admin",
    ]);
    const notified = await raw(async (fsdb) =>
      (await getDocs(collection(fsdb, "notifications"))).docs.filter((d) => d.data().userId === DJ).length
    );
    expect(notified).toBeGreaterThanOrEqual(3);

    as(CLIENT);
    await resenar(await load(cid), CLIENT, 5, "Great night");
    await expect(resenar(await load(cid), CLIENT, 1, "second review")).rejects.toThrow(); // one per hiring
    const reviews = await raw(async (fsdb) => (await getDocs(collection(fsdb, "reviews"))).size);
    expect(reviews).toBe(1);
  });

  it("the DJ cancels a confirmed booking: the client gets the whole deposit back", async () => {
    const cid = await confirmed();
    as(DJ);
    await ejecutar(cid, "cancelar", DJ, { motivo: "Double booked" });
    expect((await hiring(cid)).reparto).toEqual({ clienteCents: 7500, timelessCents: 0, djCents: 0 });

    as(ADMIN);
    await liquidarMovimiento(cid, "reembolso", actor);
    expect(await balance(CLIENT)).toBe(75);
    expect(await balance(DJ)).toBe(0);
    // Timeless keeps nothing, so no commission is recorded.
    expect(await movement(`${cid}_comision`)).toBeUndefined();
    expect((await hiring(cid)).status).toBe("cancelada");
  });

  it("the client cancels early and late", async () => {
    let cid = await confirmed();
    as(CLIENT);
    await ejecutar(cid, "cancelar", CLIENT);
    expect(await movement(`${cid}_reembolso`)).toMatchObject({ amountCents: 3000, userId: CLIENT });
    as(ADMIN);
    await liquidarMovimiento(cid, "reembolso", actor);
    expect(await balance(CLIENT)).toBe(30);
    expect(await movement(`${cid}_comision`)).toMatchObject({ amountCents: 4500 });

    await testEnv.clearFirestore();
    await raw(async (fsdb) => {
      await setDoc(doc(fsdb, "users", CLIENT), { role: "CLIENT", status: "Active", name: "Ana" });
      await setDoc(doc(fsdb, "users", DJ), { role: "TALENT", status: "Active", name: "Luna" });
      await setDoc(doc(fsdb, "users", ADMIN), { role: "ADMIN", status: "Active", name: "Root" });
      await setDoc(doc(fsdb, "talents", DJ), { userId: DJ, name: "Luna", isApproved: true, servicePlans: [PLAN] });
    });
    cid = await confirmed();
    await moveEvent(cid, 3 * DAY);
    as(CLIENT);
    await ejecutar(cid, "cancelar", CLIENT);
    expect(await movement(`${cid}_pago_dj`)).toMatchObject({ amountCents: 3000, userId: DJ });
    as(ADMIN);
    await liquidarMovimiento(cid, "pago_dj", actor);
    expect(await balance(DJ)).toBe(30);
    expect(await balance(CLIENT)).toBe(0);
  });

  it("a rejected deposit can be reported again", async () => {
    const cid = await request();
    as(DJ);
    await ejecutar(cid, "aceptar", DJ);
    as(CLIENT);
    await reportarAnticipo(await load(cid), CLIENT, { source: "cash", reference: "Given to Root" });
    as(ADMIN);
    await rechazarAnticipo(cid, actor);
    expect((await hiring(cid)).status).toBe("aceptada");
    as(CLIENT);
    await reportarAnticipo(await load(cid), CLIENT, { source: "manual_transfer", reference: "Transfer #4480" });
    expect(await movement(`${cid}_anticipo`)).toMatchObject({ status: "processing", reference: "Transfer #4480" });
  });

  it("a dispute freezes the booking until an admin decides", async () => {
    const cid = await confirmed();
    await moveEvent(cid, -DAY);
    as(DJ);
    await ejecutar(cid, "abrir_disputa", DJ, { motivo: "Client says I did not play, I did" });
    as(CLIENT);
    await expect(ejecutar(cid, "confirmar_realizada", CLIENT)).rejects.toThrow();

    as(ADMIN);
    await resolverDisputa(cid, "cliente", actor);
    const closed = await hiring(cid);
    expect(closed.status).toBe("cancelada");
    expect((closed.disputa as { abierta: boolean }).abierta).toBe(false);
    await liquidarMovimiento(cid, "reembolso", actor);
    expect(await balance(CLIENT)).toBe(75);
  });

  it("an admin can dismiss a dispute or decide for the DJ", async () => {
    const cid = await confirmed();
    await moveEvent(cid, -DAY);
    as(CLIENT);
    await ejecutar(cid, "abrir_disputa", CLIENT, { motivo: "Started late" });
    as(ADMIN);
    await resolverDisputa(cid, "dj", actor);
    expect((await hiring(cid)).status).toBe("realizada");
    await liquidarMovimiento(cid, "pago_dj", actor);
    expect((await hiring(cid)).status).toBe("liquidada");
    expect(await balance(DJ)).toBe(30);
  });

  it("the wallet screen cannot settle a booking's movement behind its back", async () => {
    const cid = await confirmed();
    as(DJ);
    await ejecutar(cid, "cancelar", DJ);
    as(ADMIN);
    await expect(resolveTransaction(`${cid}_reembolso`, "completed", actor)).rejects.toThrow(/booking/);
    expect(await balance(CLIENT)).toBe(0);
  });

  it("an unanswered request can be closed once its deadline passes", async () => {
    const cid = await request();
    as(DJ);
    await expect(ejecutar(cid, "expirar", DJ)).rejects.toThrow();
    await raw((fsdb) =>
      updateDoc(doc(fsdb, "contrataciones", cid), { updatedAt: Timestamp.fromMillis(Date.now() - 4 * DAY) })
    );
    as(ADMIN);
    await expirarComoAdmin(cid, actor);
    expect((await hiring(cid)).status).toBe("expirada");
  });

  it("one open request per client and DJ; a new one once it closes", async () => {
    const cid = await request();
    await expect(request()).rejects.toThrow(/already have an open request/);
    as(CLIENT);
    await ejecutar(cid, "cancelar", CLIENT);
    const second = await request();
    expect(second).not.toBe(cid);
    expect((await hiring(second)).event).toMatchObject({ place: "EC", tz: "America/Guayaquil" });
  });

  it("a party cannot do the other party's part", async () => {
    const cid = await request();
    as(CLIENT);
    await expect(ejecutar(cid, "aceptar", CLIENT)).rejects.toThrow();
    as(DJ);
    await ejecutar(cid, "aceptar", DJ);
    await expect(reportarAnticipo(await load(cid), DJ, { source: "cash", reference: "x" })).rejects.toThrow();
    as(DJ);
    await expect(verificarAnticipo(cid, { id: DJ, name: "Luna" })).rejects.toThrow();
  });
});
