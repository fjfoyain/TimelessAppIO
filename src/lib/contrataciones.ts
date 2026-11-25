// Firestore side of the hiring flow. The decisions live in ./contratacion
// (pure, tested) and are enforced by firestore.rules; this file only turns a
// decision into one atomic write: the hiring, its history entry, any money
// movement it owes and the notification to the other party.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { applyToBalance, auditEntry, createNotification } from "./firestore";
import {
  COMMISSION_PCT,
  DEPOSIT_PCT,
  EVENT_PLACES,
  MAX_ADVANCE_DAYS,
  bucketDe,
  dollars,
  estaVencida,
  ofertaError,
  paso,
  repartoRealizada,
  rolDe,
  type Accion,
  type Contratacion,
  type Estado,
  type Reparto,
  type Rol,
  type SizeKind,
  type Transicion,
  type TransicionKind,
} from "./contratacion";
import type { AdminActor, ServicePlan, TransactionSource, TransactionStatus } from "@/types";

export type MovimientoTipo = "anticipo" | "pago_dj" | "reembolso";

export interface Movimiento {
  id: string;
  tipo: MovimientoTipo;
  userId: string;
  amountCents: number;
  status: TransactionStatus;
  source?: string;
  reference?: string;
}

const millis = (v: unknown): number => (v instanceof Timestamp ? v.toMillis() : 0);

function toContratacion(snap: DocumentSnapshot<DocumentData>): Contratacion {
  const d = snap.data() ?? {};
  return {
    ...(d as Omit<Contratacion, "id" | "event" | "createdAt" | "updatedAt" | "disputa">),
    id: snap.id,
    event: { ...d.event, at: millis(d.event?.at) },
    ...(d.disputa ? { disputa: { ...d.disputa, at: millis(d.disputa.at) } } : {}),
    createdAt: millis(d.createdAt),
    updatedAt: millis(d.updatedAt),
  };
}

const hiringRef = (cid: string) => doc(db, "contrataciones", cid);
const stepRef = (cid: string, seq: number) => doc(db, "contrataciones", cid, "transiciones", String(seq));
const movRef = (cid: string, tipo: MovimientoTipo | "comision") => doc(db, "transactions", `${cid}_${tipo}`);

function notification(cid: string, seq: number, userId: string, title: string, description: string) {
  return {
    ref: doc(db, "notifications", `${cid}_${seq}_${userId}`),
    data: {
      userId,
      type: "contratacion",
      contratacionId: cid,
      seq,
      title: title.slice(0, 80),
      description: description.slice(0, 300),
      isNew: true,
      createdAt: serverTimestamp(),
    },
  };
}

// ─── Reads ───────────────────────────────────────────────────────

// Sorted in memory, so no composite index is needed.
export function subscribeContrataciones(uid: string, callback: (items: Contratacion[]) => void): Unsubscribe {
  const q = query(collection(db, "contrataciones"), where("parties", "array-contains", uid));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(toContratacion).sort((a, b) => b.updatedAt - a.updatedAt));
  });
}

export function subscribeContratacion(
  cid: string,
  callback: (item: Contratacion | null) => void,
  onError: () => void = () => callback(null)
): Unsubscribe {
  return onSnapshot(hiringRef(cid), (snap) => callback(snap.exists() ? toContratacion(snap) : null), onError);
}

export function subscribeTransiciones(cid: string, callback: (items: Transicion[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "contrataciones", cid, "transiciones"), (snap) => {
    callback(
      snap.docs
        .map((d) => ({ ...(d.data() as Omit<Transicion, "at">), at: millis(d.data().at) }))
        .sort((a, b) => a.seq - b.seq)
    );
  });
}

// The money movements of one hiring, by their fixed ids. Both parties may read them.
export function subscribeMovimientos(
  cid: string,
  callback: (items: Partial<Record<MovimientoTipo, Movimiento>>) => void
): Unsubscribe {
  const state: Partial<Record<MovimientoTipo, Movimiento>> = {};
  const tipos: MovimientoTipo[] = ["anticipo", "pago_dj", "reembolso"];
  const unsubs = tipos.map((tipo) =>
    onSnapshot(
      movRef(cid, tipo),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          state[tipo] = {
            id: snap.id,
            tipo,
            userId: d.userId,
            amountCents: d.amountCents,
            status: d.status,
            source: d.source,
            reference: d.reference,
          };
        } else {
          delete state[tipo];
        }
        callback({ ...state });
      },
      () => callback({ ...state })
    )
  );
  return () => unsubs.forEach((u) => u());
}

export async function getAllContrataciones(): Promise<Contratacion[]> {
  const snap = await getDocs(collection(db, "contrataciones"));
  return snap.docs.map(toContratacion).sort((a, b) => b.updatedAt - a.updatedAt);
}

// The hiring a client and a talent are currently working on, if any — used to
// open the existing one instead of stacking duplicate requests.
export async function findOpenContratacion(clientId: string, talentId: string): Promise<Contratacion | null> {
  const snap = await getDocs(query(collection(db, "contrataciones"), where("parties", "array-contains", clientId)));
  const open: Estado[] = ["solicitada", "negociacion", "aceptada"];
  return (
    snap.docs
      .map(toContratacion)
      .filter((c) => c.clientId === clientId && c.talentId === talentId && open.includes(c.status))
      .sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null
  );
}

// ─── Party actions ───────────────────────────────────────────────

export async function solicitar(input: {
  client: { id: string; name: string };
  talent: { id: string; name: string };
  plan: ServicePlan;
  planIndex: number;
  event: { at: Date; type: string; sizeKind: SizeKind; sizeRange: string; place: string };
  offerCents: number;
  conversationId: string | null;
}): Promise<string> {
  const listCents = input.plan.price * 100;
  const problem = ofertaError(input.offerCents, listCents);
  if (problem) throw new Error(problem);
  const bucket = bucketDe(input.event.sizeKind, input.event.sizeRange);
  if (!bucket) throw new Error("Choose the size of the event.");
  const tz = EVENT_PLACES.find((p) => p.value === input.event.place)?.tz;
  if (!tz) throw new Error("Choose where the event takes place.");
  if (input.event.at.getTime() <= Date.now()) throw new Error("The event must be in the future.");
  if (input.event.at.getTime() > Date.now() + MAX_ADVANCE_DAYS * 86_400_000) {
    throw new Error(`The event can be at most ${MAX_ADVANCE_DAYS} days ahead.`);
  }
  if (input.planIndex < 0) throw new Error("This plan is no longer available. Reload the profile.");

  const ref = doc(collection(db, "contrataciones"));
  const batch = writeBatch(db);
  batch.set(ref, {
    clientId: input.client.id,
    talentId: input.talent.id,
    parties: [input.client.id, input.talent.id],
    clientName: input.client.name,
    talentName: input.talent.name,
    conversationId: input.conversationId,
    plan: { id: input.plan.id, title: input.plan.title, index: input.planIndex },
    listCents,
    commissionPct: COMMISSION_PCT,
    depositPct: DEPOSIT_PCT,
    event: {
      at: Timestamp.fromDate(input.event.at),
      type: input.event.type,
      sizeKind: input.event.sizeKind,
      sizeRange: input.event.sizeRange,
      bucket,
      place: input.event.place,
      tz,
    },
    status: "solicitada",
    seq: 1,
    oferta: { amountCents: input.offerCents, by: input.client.id },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(stepRef(ref.id, 1), {
    seq: 1,
    from: null,
    to: "solicitada",
    kind: "solicitud",
    by: input.client.id,
    rol: "cliente",
    at: serverTimestamp(),
    offerCents: input.offerCents,
  });
  const n = notification(
    ref.id,
    1,
    input.talent.id,
    "New booking request",
    `${input.client.name} requested ${input.plan.title} at ${dollars(input.offerCents)}.`
  );
  batch.set(n.ref, n.data);
  // One open request per client and talent (see solicitudesAbiertas in the rules).
  batch.set(doc(db, "solicitudesAbiertas", `${input.client.id}_${input.talent.id}`), {
    clientId: input.client.id,
    talentId: input.talent.id,
    cid: ref.id,
    updatedAt: serverTimestamp(),
  });
  try {
    await batch.commit();
  } catch (err) {
    if ((err as { code?: string }).code === "permission-denied") {
      throw new Error("You already have an open request with this DJ. Finish or cancel it before sending another.");
    }
    throw err;
  }
  return ref.id;
}

// Takes one step on behalf of a party. Runs in a transaction so two people
// acting at once cannot both win: the second one re-reads and is re-checked.
export async function ejecutar(
  cid: string,
  accion: Exclude<Accion, "reportar_anticipo">,
  uid: string,
  payload: { amountCents?: number; motivo?: string } = {}
): Promise<void> {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(hiringRef(cid));
    if (!snap.exists()) throw new Error("This booking no longer exists.");
    const c = toContratacion(snap);
    const rol = rolDe(c, uid);
    if (!rol) throw new Error("You are not part of this booking.");
    // A reported deposit freezes an agreed booking until an admin resolves it.
    if (c.status === "aceptada") {
      const deposit = await tx.get(movRef(cid, "anticipo"));
      if (deposit.exists() && deposit.data().status === "processing") {
        throw new Error("The deposit is being verified. This booking cannot change until that is resolved.");
      }
    }

    const p = paso(c, accion, uid, Date.now(), payload);
    const seq = c.seq + 1;
    const patch: Record<string, unknown> = { ...p.patch };
    if (p.patch.disputa) patch.disputa = { ...p.patch.disputa, at: serverTimestamp() };

    tx.update(hiringRef(cid), { ...patch, status: p.to, seq, updatedAt: serverTimestamp() });
    tx.set(stepRef(cid, seq), {
      seq,
      from: c.status,
      to: p.to,
      kind: p.kind,
      by: uid,
      rol,
      at: serverTimestamp(),
      ...(p.offerCents !== undefined ? { offerCents: p.offerCents } : {}),
      ...(p.motivo ? { motivo: p.motivo } : {}),
    });
    if (p.movimiento) {
      tx.set(movRef(cid, p.movimiento.tipo), {
        userId: p.movimiento.userId,
        contratacionId: cid,
        type: p.movimiento.tipo === "pago_dj" ? "payout" : "refund",
        amountCents: p.movimiento.cents,
        amount: p.movimiento.cents / 100,
        source: "contratacion",
        status: "processing",
        description: p.movimiento.description.slice(0, 200),
        createdAt: serverTimestamp(),
      });
    }
    const other = rol === "cliente" ? c.talentId : c.clientId;
    const n = notification(cid, seq, other, p.notificacion.title, p.notificacion.description);
    tx.set(n.ref, n.data);
  });
}

// The client tells Timeless the deposit was sent. Nothing is confirmed until
// an admin verifies that the money arrived.
export async function reportarAnticipo(
  c: Contratacion,
  uid: string,
  input: { source: Extract<TransactionSource, "manual_transfer" | "cash">; reference: string }
): Promise<void> {
  if (uid !== c.clientId) throw new Error("Only the client reports the deposit.");
  if (c.status !== "aceptada" || !c.desglose) throw new Error("The price has not been agreed yet.");
  if (estaVencida(c, Date.now())) throw new Error("The deadline to pay the deposit has passed.");

  const ref = movRef(c.id, "anticipo");
  const reference = input.reference.trim().slice(0, 120);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    if (existing.data().status !== "rejected") throw new Error("The deposit was already reported.");
    await updateDoc(ref, { status: "processing", source: input.source, reference, createdAt: serverTimestamp() });
    return;
  }
  await setDoc(ref, {
    userId: uid,
    contratacionId: c.id,
    type: "payment",
    amountCents: c.desglose.depositCents,
    amount: c.desglose.depositCents / 100,
    source: input.source,
    status: "processing",
    reference,
    description: `Deposit — ${c.plan.title}`.slice(0, 200),
    createdAt: serverTimestamp(),
  });
}

// One review per completed hiring: its id is the hiring's id.
export async function resenar(c: Contratacion, uid: string, rating: number, comment: string): Promise<void> {
  await setDoc(doc(db, "reviews", c.id), {
    talentId: c.talentId,
    clientId: uid,
    clientName: c.clientName,
    rating,
    comment: comment.trim().slice(0, 1000),
    createdAt: serverTimestamp(),
  });
}

export async function hasReview(cid: string): Promise<boolean> {
  return (await getDoc(doc(db, "reviews", cid))).exists();
}

// ─── Admin actions ───────────────────────────────────────────────

type Tx = Parameters<Parameters<typeof runTransaction>[1]>[0];

function adminStep(tx: Tx, c: Contratacion, to: Estado, kind: TransicionKind, actor: AdminActor, patch: Record<string, unknown> = {}) {
  const seq = c.seq + 1;
  tx.update(hiringRef(c.id), { ...patch, status: to, seq, updatedAt: serverTimestamp() });
  tx.set(stepRef(c.id, seq), { seq, from: c.status, to, kind, by: actor.id, rol: "admin" satisfies Rol, at: serverTimestamp() });
  return seq;
}

async function notifyBoth(c: Contratacion, title: string, description: string) {
  // The step is already committed; a notification is a courtesy on top of it.
  await Promise.allSettled(
    c.parties.map((userId) => createNotification({ userId, type: "contract", title, description }))
  );
}

async function load(tx: Tx, cid: string): Promise<Contratacion> {
  const snap = await tx.get(hiringRef(cid));
  if (!snap.exists()) throw new Error("This booking no longer exists.");
  return toContratacion(snap);
}

// Deposit arrived → the hiring is Confirmed.
export async function verificarAnticipo(cid: string, actor: AdminActor): Promise<void> {
  let c: Contratacion | null = null;
  await runTransaction(db, async (tx) => {
    c = await load(tx, cid);
    const ref = movRef(cid, "anticipo");
    const mov = await tx.get(ref);
    if (c.status !== "aceptada") throw new Error("This booking is not waiting for a deposit.");
    if (!mov.exists() || mov.data().status !== "processing") throw new Error("There is no deposit to verify.");
    tx.update(ref, { status: "completed", resolvedBy: actor.id, resolvedAt: serverTimestamp() });
    adminStep(tx, c, "confirmada", "confirmacion", actor);
    const log = auditEntry(actor, `Deposit of ${dollars(mov.data().amountCents)} verified — ${c.clientName} → ${c.talentName} (${cid})`);
    tx.set(log.ref, log.data);
  });
  if (c) await notifyBoth(c, "Booking confirmed", `The deposit for ${(c as Contratacion).plan.title} was verified. The date is locked in.`);
}

export async function rechazarAnticipo(cid: string, actor: AdminActor): Promise<void> {
  let c: Contratacion | null = null;
  await runTransaction(db, async (tx) => {
    c = await load(tx, cid);
    const ref = movRef(cid, "anticipo");
    const mov = await tx.get(ref);
    if (!mov.exists() || mov.data().status !== "processing") throw new Error("There is no deposit to reject.");
    tx.update(ref, { status: "rejected", resolvedBy: actor.id, resolvedAt: serverTimestamp() });
    const log = auditEntry(actor, `Deposit rejected — ${c.clientName} → ${c.talentName} (${cid})`, "Warning");
    tx.set(log.ref, log.data);
  });
  if (c) {
    const hiring = c as Contratacion;
    await Promise.allSettled([
      createNotification({
        userId: hiring.clientId,
        type: "payment",
        title: "Deposit could not be verified",
        description: `We could not find your deposit for ${hiring.plan.title}. Check the reference and report it again.`,
      }),
    ]);
  }
}

// Pays out a pending movement of a hiring (held deposit to the DJ, or a refund
// to the client) into the beneficiary's wallet. Releasing the held deposit of
// a completed hiring also settles it.
export async function liquidarMovimiento(cid: string, tipo: "pago_dj" | "reembolso", actor: AdminActor): Promise<void> {
  let c: Contratacion | null = null;
  await runTransaction(db, async (tx) => {
    c = await load(tx, cid);
    const ref = movRef(cid, tipo);
    const mov = await tx.get(ref);
    if (!mov.exists() || mov.data().status !== "processing") throw new Error("This payment was already settled.");
    const { userId, amountCents } = mov.data() as { userId: string; amountCents: number };
    // Pay only what this hiring's split says, to whom it says.
    const expected = tipo === "pago_dj"
      ? { userId: c.talentId, cents: c.reparto?.djCents }
      : { userId: c.clientId, cents: c.reparto?.clienteCents };
    if (mov.data().contratacionId !== cid || userId !== expected.userId || amountCents !== expected.cents) {
      throw new Error("This movement does not match the booking. Do not pay it; review it by hand.");
    }
    const walletRef = doc(db, "wallets", userId);
    const walletSnap = await tx.get(walletRef);
    const commissionRef = movRef(cid, "comision");
    const commissionSnap = await tx.get(commissionRef);

    tx.update(ref, { status: "completed", resolvedBy: actor.id, resolvedAt: serverTimestamp() });
    applyToBalance(tx, walletRef, walletSnap, userId, amountCents / 100);

    const timelessCents = c.reparto?.timelessCents ?? 0;
    if (timelessCents > 0 && !commissionSnap.exists()) {
      tx.set(commissionRef, {
        userId: "timeless",
        contratacionId: cid,
        type: "commission",
        amountCents: timelessCents,
        amount: timelessCents / 100,
        source: "contratacion",
        status: "completed",
        description: `Commission — ${c.plan.title}`,
        createdAt: serverTimestamp(),
      });
    }
    if (c.status === "realizada" && tipo === "pago_dj") {
      adminStep(tx, c, "liquidada", "liquidacion", actor);
    }
    const log = auditEntry(
      actor,
      `${tipo === "pago_dj" ? "Held deposit released to DJ" : "Refund to client"}: ${dollars(amountCents)} (${cid})`
    );
    tx.set(log.ref, log.data);
  });
  if (c) {
    const hiring = c as Contratacion;
    await Promise.allSettled([
      createNotification({
        userId: tipo === "pago_dj" ? hiring.talentId : hiring.clientId,
        type: "payment",
        title: tipo === "pago_dj" ? "Held deposit released" : "Refund issued",
        description: `The amount for ${hiring.plan.title} is now in your Timeless balance.`,
      }),
    ]);
  }
}

// How an admin closes a dispute:
//   descartar → nothing was wrong; the hiring continues
//   dj        → the service was delivered; the held deposit goes to the DJ
//   cliente   → it was not; the client recovers the whole deposit
export async function resolverDisputa(cid: string, decision: "descartar" | "dj" | "cliente", actor: AdminActor): Promise<void> {
  let c: Contratacion | null = null;
  await runTransaction(db, async (tx) => {
    c = await load(tx, cid);
    if (c.status !== "confirmada" || !c.disputa?.abierta || !c.desglose) throw new Error("There is no open dispute.");
    const snap = await tx.get(hiringRef(cid));
    const cerrada = { ...snap.data()?.disputa, abierta: false };

    const owe = (tipo: "pago_dj" | "reembolso", cents: number, userId: string, description: string) =>
      tx.set(movRef(cid, tipo), {
        userId,
        contratacionId: cid,
        type: tipo === "pago_dj" ? "payout" : "refund",
        amountCents: cents,
        amount: cents / 100,
        source: "contratacion",
        status: "processing",
        description,
        createdAt: serverTimestamp(),
      });

    if (decision === "descartar") {
      adminStep(tx, c, "confirmada", "disputa", actor, { disputa: cerrada });
    } else if (decision === "dj") {
      const reparto: Reparto = repartoRealizada(c);
      adminStep(tx, c, "realizada", "realizacion", actor, { reparto, disputa: cerrada });
      owe("pago_dj", reparto.djCents, c.talentId, `Held deposit — ${c.plan.title}`);
    } else {
      const reparto: Reparto = { clienteCents: c.desglose.depositCents, timelessCents: 0, djCents: 0 };
      adminStep(tx, c, "cancelada", "cancelacion", actor, {
        reparto,
        disputa: cerrada,
        cancelacion: { by: actor.id, rol: "admin", motivo: "Dispute resolved for the client" },
      });
      owe("reembolso", reparto.clienteCents, c.clientId, `Refund — ${c.plan.title}`);
    }
    const log = auditEntry(actor, `Dispute resolved (${decision}) — ${c.clientName} / ${c.talentName} (${cid})`, "Warning");
    tx.set(log.ref, log.data);
  });
  if (c) await notifyBoth(c, "Dispute resolved", `Timeless reviewed the dispute on ${(c as Contratacion).plan.title}. Open the booking for the outcome.`);
}

// Closes a hiring whose deadline passed and nobody acted on.
export async function expirarComoAdmin(cid: string, actor: AdminActor): Promise<void> {
  await runTransaction(db, async (tx) => {
    const c = await load(tx, cid);
    if (!estaVencida(c, Date.now())) throw new Error("This booking has not reached its deadline.");
    const deposit = await tx.get(movRef(cid, "anticipo"));
    if (deposit.exists() && deposit.data().status === "processing") {
      throw new Error("The client reported a deposit. Verify or reject it first.");
    }
    adminStep(tx, c, "expirada", "expiracion", actor);
  });
}
