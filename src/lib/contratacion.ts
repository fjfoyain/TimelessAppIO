// The hiring flow ("contratación") as pure rules: no Firebase in this file.
//
// Everything here is mirrored by firestore.rules, which is the real barrier —
// the client can be bypassed, the rules cannot. This module exists so the UI
// offers exactly the actions the rules will accept, and so the arithmetic and
// the deadlines are unit-tested. A test compares its constants with the rules.
//
// Money is integer cents and agreed prices are whole dollars, so 15% and 25%
// are always exact: no rounding, nothing for the two sides to disagree about.

export const COMMISSION_PCT = 15;
export const DEPOSIT_PCT = 25;
export const OFFER_MIN_PCT = 50;
export const OFFER_MAX_PCT = 200;
// Refund terms change, and the dispute window closes, this many days around the event.
export const WINDOW_DAYS = 7;
export const MAX_ADVANCE_DAYS = 539;
export const MAX_SEQ = 60;

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export type Estado =
  | "solicitada"
  | "negociacion"
  | "aceptada"
  | "confirmada"
  | "realizada"
  | "liquidada"
  | "cancelada"
  | "expirada";

export type Rol = "cliente" | "dj" | "admin";
export type Bucket = "chico" | "grande";
export type SizeKind = "personas" | "tickets" | "m2";

// Hours a hiring may sit in a state before either side can expire it.
export const PLAZO_HORAS: Record<"solicitada" | "negociacion" | "aceptada", Record<Bucket, number>> = {
  solicitada: { chico: 72, grande: 72 },
  negociacion: { chico: 168, grande: 720 },
  aceptada: { chico: 72, grande: 168 },
};

export const SIZE_RANGES: Record<SizeKind, { value: string; label: string; bucket: Bucket }[]> = {
  personas: [
    { value: "hasta50", label: "Up to 50", bucket: "chico" },
    { value: "hasta100", label: "51–100", bucket: "chico" },
    { value: "hasta300", label: "101–300", bucket: "grande" },
    { value: "mas300", label: "300+", bucket: "grande" },
  ],
  tickets: [
    { value: "hasta50", label: "Up to 50", bucket: "chico" },
    { value: "hasta100", label: "51–100", bucket: "chico" },
    { value: "hasta300", label: "101–300", bucket: "grande" },
    { value: "mas300", label: "300+", bucket: "grande" },
  ],
  m2: [
    { value: "hasta80", label: "Up to 80 m²", bucket: "chico" },
    { value: "hasta150", label: "81–150 m²", bucket: "chico" },
    { value: "hasta400", label: "151–400 m²", bucket: "grande" },
    { value: "mas400", label: "400+ m²", bucket: "grande" },
  ],
};

export const SIZE_KIND_LABELS: Record<SizeKind, string> = {
  personas: "Guests",
  tickets: "Tickets",
  m2: "Venue size",
};

export const EVENT_KINDS: { value: string; label: string }[] = [
  { value: "boda", label: "Wedding" },
  { value: "cumpleanos", label: "Birthday" },
  { value: "fiesta_privada", label: "Private party" },
  { value: "corporativo", label: "Corporate" },
  { value: "discoteca", label: "Club night" },
  { value: "festival", label: "Festival" },
  { value: "otro", label: "Other" },
];

export const ESTADO_LABELS: Record<Estado, string> = {
  solicitada: "Requested",
  negociacion: "Negotiating",
  aceptada: "Accepted",
  confirmada: "Confirmed",
  realizada: "Completed",
  liquidada: "Settled",
  cancelada: "Cancelled",
  expirada: "Expired",
};

// The six agreed steps, in order. Cancelled and Expired end the flow early.
export const PASOS: Estado[] = ["solicitada", "negociacion", "aceptada", "confirmada", "realizada", "liquidada"];

export interface Desglose {
  commissionCents: number; // Timeless
  talentNetCents: number; // what the DJ ends up with
  depositCents: number; // paid up front through Timeless
  heldCents: number; // DJ's share of the deposit, held until the service happens
  directCents: number; // paid by the client straight to the DJ
}

export interface Reparto {
  clienteCents: number;
  timelessCents: number;
  djCents: number;
}

export interface Oferta {
  amountCents: number;
  by: string;
}

export interface Contratacion {
  id: string;
  clientId: string;
  talentId: string;
  parties: string[];
  clientName: string;
  talentName: string;
  conversationId: string | null;
  plan: { id: string; title: string; index: number };
  listCents: number;
  commissionPct: number;
  depositPct: number;
  event: { at: number; type: string; sizeKind: SizeKind; sizeRange: string; bucket: Bucket };
  status: Estado;
  seq: number;
  oferta: Oferta;
  agreedCents?: number;
  desglose?: Desglose;
  disputa?: { abierta: boolean; by: string; at: number; motivo: string };
  cancelacion?: { by: string; rol: Rol; motivo?: string };
  reparto?: Reparto;
  createdAt: number;
  updatedAt: number;
}

export interface Transicion {
  seq: number;
  from: Estado | null;
  to: Estado;
  kind: TransicionKind;
  by: string;
  rol: Rol;
  at: number;
  offerCents?: number;
  motivo?: string;
}

export type TransicionKind =
  | "solicitud"
  | "oferta"
  | "aceptacion"
  | "confirmacion"
  | "disputa"
  | "realizacion"
  | "liquidacion"
  | "cancelacion"
  | "expiracion";

// ─── Money ───────────────────────────────────────────────────────

export function dollars(cents: number): string {
  const value = cents / 100;
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function desglose(
  agreedCents: number,
  commissionPct: number = COMMISSION_PCT,
  depositPct: number = DEPOSIT_PCT
): Desglose {
  if (!Number.isInteger(agreedCents) || agreedCents <= 0 || agreedCents % 100 !== 0) {
    throw new Error("The agreed price must be a whole number of dollars.");
  }
  const commissionCents = (agreedCents * commissionPct) / 100;
  const depositCents = (agreedCents * depositPct) / 100;
  return {
    commissionCents,
    talentNetCents: agreedCents - commissionCents,
    depositCents,
    heldCents: depositCents - commissionCents,
    directCents: agreedCents - depositCents,
  };
}

export function offerBounds(listCents: number): { minCents: number; maxCents: number } {
  // Rounded inward to whole dollars, so the limits are never looser than the percentage.
  return {
    minCents: Math.ceil((listCents * OFFER_MIN_PCT) / 100 / 100) * 100,
    maxCents: Math.floor((listCents * OFFER_MAX_PCT) / 100 / 100) * 100,
  };
}

// Returns why an offer is not acceptable, or null when it is.
export function ofertaError(amountCents: number, listCents: number): string | null {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return "Enter a valid amount.";
  if (!Number.isInteger(amountCents) || amountCents % 100 !== 0) return "Use whole dollars, without cents.";
  const { minCents, maxCents } = offerBounds(listCents);
  if (amountCents < minCents || amountCents > maxCents) {
    return `Offers for this plan must be between ${dollars(minCents)} and ${dollars(maxCents)}.`;
  }
  return null;
}

// ─── Event size ──────────────────────────────────────────────────

export function bucketDe(kind: SizeKind, range: string): Bucket | null {
  return SIZE_RANGES[kind]?.find((r) => r.value === range)?.bucket ?? null;
}

// ─── Deadlines ───────────────────────────────────────────────────

type Timed = Pick<Contratacion, "status" | "updatedAt" | "event">;

// When this hiring can be expired, or null if its state has no deadline.
// The event itself is always a deadline: nothing can still be pending once it starts.
export function venceEn(c: Timed): number | null {
  if (c.status !== "solicitada" && c.status !== "negociacion" && c.status !== "aceptada") return null;
  return Math.min(c.event.at, c.updatedAt + PLAZO_HORAS[c.status][c.event.bucket] * HOUR);
}

export function estaVencida(c: Timed, now: number): boolean {
  if (c.status !== "solicitada" && c.status !== "negociacion" && c.status !== "aceptada") return false;
  return now >= c.event.at || now > c.updatedAt + PLAZO_HORAS[c.status][c.event.bucket] * HOUR;
}

// ─── Who gets what ───────────────────────────────────────────────

// Outcome of the deposit when a CONFIRMED hiring is cancelled.
//   client, more than 7 days ahead → client recovers the held part
//   client, 7 days or less         → the DJ keeps it for the blocked date
//   DJ cancels                     → the client recovers the whole deposit
export function repartoCancelacion(
  c: Pick<Contratacion, "desglose" | "event">,
  rol: "cliente" | "dj",
  now: number
): Reparto {
  if (!c.desglose) throw new Error("This hiring has no agreed price yet.");
  const { depositCents, commissionCents, heldCents } = c.desglose;
  if (rol === "dj") return { clienteCents: depositCents, timelessCents: 0, djCents: 0 };
  return now < c.event.at - WINDOW_DAYS * DAY
    ? { clienteCents: heldCents, timelessCents: commissionCents, djCents: 0 }
    : { clienteCents: 0, timelessCents: commissionCents, djCents: heldCents };
}

export function repartoRealizada(c: Pick<Contratacion, "desglose">): Reparto {
  if (!c.desglose) throw new Error("This hiring has no agreed price yet.");
  return { clienteCents: 0, timelessCents: c.desglose.commissionCents, djCents: c.desglose.heldCents };
}

// ─── What each side may do now ───────────────────────────────────

export type Accion =
  | "contraofertar"
  | "aceptar"
  | "reportar_anticipo"
  | "confirmar_realizada"
  | "abrir_disputa"
  | "cancelar"
  | "expirar";

export function rolDe(c: Pick<Contratacion, "clientId" | "talentId">, uid: string): "cliente" | "dj" | null {
  if (uid === c.clientId) return "cliente";
  if (uid === c.talentId) return "dj";
  return null;
}

// `anticipoPendiente`: the client reported the deposit and an admin has not
// resolved it yet. That stops the clock — a client who already paid must not
// lose the booking because verification took a day.
export function acciones(
  c: Contratacion,
  uid: string,
  now: number,
  ctx: { anticipoPendiente: boolean } = { anticipoPendiente: false }
): Accion[] {
  const rol = rolDe(c, uid);
  if (!rol) return [];
  const vencida = estaVencida(c, now);
  const theirTurn = c.oferta.by !== uid;

  switch (c.status) {
    case "solicitada":
      if (vencida) return ["expirar"];
      return rol === "dj" ? ["aceptar", "contraofertar", "cancelar"] : ["cancelar"];
    case "negociacion":
      if (vencida) return ["expirar"];
      return theirTurn && c.seq < MAX_SEQ ? ["aceptar", "contraofertar", "cancelar"] : ["cancelar"];
    case "aceptada":
      if (ctx.anticipoPendiente) return [];
      if (vencida) return ["expirar"];
      return rol === "cliente" ? ["reportar_anticipo", "cancelar"] : ["cancelar"];
    case "confirmada": {
      const enDisputa = c.disputa?.abierta === true;
      const out: Accion[] = [];
      if (now < c.event.at) out.push("cancelar");
      if (!enDisputa && ((rol === "cliente" && now >= c.event.at) || now >= c.event.at + WINDOW_DAYS * DAY)) {
        out.push("confirmar_realizada");
      }
      if (!c.disputa && now >= c.event.at && now < c.event.at + WINDOW_DAYS * DAY) out.push("abrir_disputa");
      return out;
    }
    default:
      return [];
  }
}

// ─── The write each action produces ──────────────────────────────

export interface Paso {
  // Fields of the hiring that change (status, seq and updatedAt are added by the data layer).
  patch: Partial<Pick<Contratacion, "oferta" | "agreedCents" | "desglose" | "reparto" | "cancelacion">> & {
    disputa?: { abierta: boolean; by: string; motivo: string };
  };
  to: Estado;
  kind: TransicionKind;
  offerCents?: number;
  motivo?: string;
  // A pending money movement created with the transition; an admin settles it.
  movimiento?: { tipo: "pago_dj" | "reembolso"; cents: number; userId: string; description: string };
  notificacion: { title: string; description: string };
}

// Builds the write for `accion`, or throws with the reason it is not allowed.
// Pure: the data layer stamps server time and commits it in one batch.
export function paso(
  c: Contratacion,
  accion: Exclude<Accion, "reportar_anticipo">,
  uid: string,
  now: number,
  payload: { amountCents?: number; motivo?: string } = {}
): Paso {
  const rol = rolDe(c, uid);
  if (!rol || !acciones(c, uid, now).includes(accion)) {
    throw new Error("That action is not available right now.");
  }
  const who = rol === "cliente" ? c.clientName : c.talentName;

  switch (accion) {
    case "contraofertar": {
      const amountCents = payload.amountCents ?? NaN;
      const problem = ofertaError(amountCents, c.listCents);
      if (problem) throw new Error(problem);
      return {
        patch: { oferta: { amountCents, by: uid } },
        to: "negociacion",
        kind: "oferta",
        offerCents: amountCents,
        notificacion: {
          title: `New offer: ${dollars(amountCents)}`,
          description: `${who} proposed ${dollars(amountCents)} for ${c.plan.title}.`,
        },
      };
    }
    case "aceptar": {
      const agreedCents = c.oferta.amountCents;
      return {
        patch: { agreedCents, desglose: desglose(agreedCents, c.commissionPct, c.depositPct) },
        to: "aceptada",
        kind: "aceptacion",
        notificacion: {
          title: `Agreed at ${dollars(agreedCents)}`,
          description: `${who} accepted. The booking is confirmed once the deposit is verified.`,
        },
      };
    }
    case "confirmar_realizada": {
      const reparto = repartoRealizada(c);
      return {
        patch: { reparto },
        to: "realizada",
        kind: "realizacion",
        movimiento: {
          tipo: "pago_dj",
          cents: reparto.djCents,
          userId: c.talentId,
          description: `Held deposit — ${c.plan.title}`,
        },
        notificacion: {
          title: "Service marked as completed",
          description: `${c.plan.title} was marked as completed. The held deposit is being released.`,
        },
      };
    }
    case "abrir_disputa": {
      const motivo = (payload.motivo ?? "").trim();
      if (!motivo) throw new Error("Explain what happened.");
      return {
        patch: { disputa: { abierta: true, by: uid, motivo: motivo.slice(0, 1000) } },
        to: "confirmada",
        kind: "disputa",
        motivo: motivo.slice(0, 1000),
        notificacion: {
          title: "A dispute was opened",
          description: `${who} reported a problem with ${c.plan.title}. Timeless will review it.`,
        },
      };
    }
    case "cancelar": {
      const motivo = (payload.motivo ?? "").trim().slice(0, 500);
      const cancelacion = { by: uid, rol, ...(motivo ? { motivo } : {}) };
      const notificacion = {
        title: "Booking cancelled",
        description: `${who} cancelled ${c.plan.title}.`,
      };
      if (c.status !== "confirmada") {
        return { patch: { cancelacion }, to: "cancelada", kind: "cancelacion", notificacion };
      }
      const reparto = repartoCancelacion(c, rol, now);
      const movimiento =
        reparto.clienteCents > 0
          ? { tipo: "reembolso" as const, cents: reparto.clienteCents, userId: c.clientId, description: `Refund — ${c.plan.title}` }
          : { tipo: "pago_dj" as const, cents: reparto.djCents, userId: c.talentId, description: `Late-cancellation compensation — ${c.plan.title}` };
      return { patch: { cancelacion, reparto }, to: "cancelada", kind: "cancelacion", movimiento, notificacion };
    }
    case "expirar":
      return {
        patch: {},
        to: "expirada",
        kind: "expiracion",
        notificacion: {
          title: "Booking request expired",
          description: `${c.plan.title} expired because its deadline passed.`,
        },
      };
  }
}
