import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  COMMISSION_PCT,
  DEPOSIT_PCT,
  PLAZO_HORAS,
  SIZE_RANGES,
  acciones,
  bucketDe,
  desglose,
  estaVencida,
  ofertaError,
  offerBounds,
  paso,
  repartoCancelacion,
  venceEn,
  type Contratacion,
} from "../contratacion";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const NOW = Date.UTC(2026, 10, 24, 15, 0);
const CLIENT = "client";
const DJ = "dj";

function hiring(over: Partial<Contratacion> = {}): Contratacion {
  return {
    id: "c1",
    clientId: CLIENT,
    talentId: DJ,
    parties: [CLIENT, DJ],
    clientName: "Ana",
    talentName: "Luna",
    conversationId: null,
    plan: { id: "pro", title: "Full Experience", index: 1 },
    listCents: 30000,
    commissionPct: 15,
    depositPct: 25,
    event: { at: NOW + 30 * DAY, type: "boda", sizeKind: "personas", sizeRange: "hasta100", bucket: "chico" },
    status: "solicitada",
    seq: 1,
    oferta: { amountCents: 30000, by: CLIENT },
    createdAt: NOW,
    updatedAt: NOW,
    ...over,
  };
}

const confirmed = (over: Partial<Contratacion> = {}) =>
  hiring({ status: "confirmada", agreedCents: 30000, desglose: desglose(30000), ...over });

describe("desglose", () => {
  it("matches the agreed $300 example", () => {
    expect(desglose(30000)).toEqual({
      commissionCents: 4500,
      talentNetCents: 25500,
      depositCents: 7500,
      heldCents: 3000,
      directCents: 22500,
    });
  });

  it("always adds up, for any whole-dollar price", () => {
    for (let dollarsPrice = 1; dollarsPrice <= 2500; dollarsPrice += 7) {
      const d = desglose(dollarsPrice * 100);
      for (const v of Object.values(d)) expect(Number.isInteger(v)).toBe(true);
      expect(d.commissionCents + d.talentNetCents).toBe(dollarsPrice * 100);
      expect(d.depositCents + d.directCents).toBe(dollarsPrice * 100);
      expect(d.commissionCents + d.heldCents).toBe(d.depositCents);
      expect(d.heldCents + d.directCents).toBe(d.talentNetCents);
    }
  });

  it("refuses prices with cents", () => {
    expect(() => desglose(30050)).toThrow();
    expect(() => desglose(0)).toThrow();
  });
});

describe("offers", () => {
  it("allows half to double the list price, in whole dollars", () => {
    expect(offerBounds(24000)).toEqual({ minCents: 12000, maxCents: 48000 });
    expect(offerBounds(7500)).toEqual({ minCents: 3800, maxCents: 15000 });
  });

  it("rejects the $2000 offer on a $240 plan", () => {
    expect(ofertaError(200000, 24000)).toMatch(/between \$120 and \$480/);
  });

  it("rejects cents, zero and non-numbers; accepts the limits", () => {
    expect(ofertaError(24050, 24000)).not.toBeNull();
    expect(ofertaError(0, 24000)).not.toBeNull();
    expect(ofertaError(NaN, 24000)).not.toBeNull();
    expect(ofertaError(12000, 24000)).toBeNull();
    expect(ofertaError(48000, 24000)).toBeNull();
  });
});

describe("event size", () => {
  it("puts up to 100 people in the small bucket and more in the large one", () => {
    expect(bucketDe("personas", "hasta100")).toBe("chico");
    expect(bucketDe("personas", "hasta300")).toBe("grande");
    expect(bucketDe("m2", "hasta150")).toBe("chico");
    expect(bucketDe("tickets", "mas300")).toBe("grande");
    expect(bucketDe("personas", "nope")).toBeNull();
  });
});

describe("deadlines", () => {
  it("gives a request 72 hours", () => {
    const c = hiring();
    expect(venceEn(c)).toBe(NOW + 72 * HOUR);
    expect(estaVencida(c, NOW + 71 * HOUR)).toBe(false);
    expect(estaVencida(c, NOW + 73 * HOUR)).toBe(true);
  });

  it("gives a large event 30 days to negotiate and a small one 7", () => {
    const small = hiring({ status: "negociacion", event: { ...hiring().event, at: NOW + 200 * DAY } });
    const large = hiring({
      status: "negociacion",
      event: { ...hiring().event, at: NOW + 200 * DAY, sizeRange: "mas300", bucket: "grande" },
    });
    expect(estaVencida(small, NOW + 8 * DAY)).toBe(true);
    expect(estaVencida(large, NOW + 8 * DAY)).toBe(false);
    expect(estaVencida(large, NOW + 31 * DAY)).toBe(true);
  });

  it("expires at the event if that comes before the deadline", () => {
    const c = hiring({ event: { ...hiring().event, at: NOW + 10 * HOUR } });
    expect(venceEn(c)).toBe(NOW + 10 * HOUR);
    expect(estaVencida(c, NOW + 10 * HOUR)).toBe(true);
  });

  it("has no deadline once confirmed", () => {
    expect(venceEn(confirmed())).toBeNull();
    expect(estaVencida(confirmed(), NOW + 400 * DAY)).toBe(false);
  });
});

describe("cancelling a confirmed booking", () => {
  it("client, more than 7 days ahead: recovers $30, Timeless keeps $45", () => {
    const c = confirmed({ event: { ...hiring().event, at: NOW + 8 * DAY } });
    expect(repartoCancelacion(c, "cliente", NOW)).toEqual({ clienteCents: 3000, timelessCents: 4500, djCents: 0 });
  });

  it("client, exactly 7 days ahead: no refund, the DJ keeps $30", () => {
    const c = confirmed({ event: { ...hiring().event, at: NOW + 7 * DAY } });
    expect(repartoCancelacion(c, "cliente", NOW)).toEqual({ clienteCents: 0, timelessCents: 4500, djCents: 3000 });
  });

  it("DJ cancels: the client recovers the whole $75", () => {
    expect(repartoCancelacion(confirmed(), "dj", NOW)).toEqual({ clienteCents: 7500, timelessCents: 0, djCents: 0 });
  });

  it("every outcome distributes exactly the deposit", () => {
    for (const days of [1, 7, 8, 60]) {
      const c = confirmed({ event: { ...hiring().event, at: NOW + days * DAY } });
      for (const rol of ["cliente", "dj"] as const) {
        const r = repartoCancelacion(c, rol, NOW);
        expect(r.clienteCents + r.timelessCents + r.djCents).toBe(7500);
      }
    }
  });
});

describe("acciones", () => {
  it("a new request waits for the DJ", () => {
    expect(acciones(hiring(), DJ, NOW)).toEqual(["aceptar", "contraofertar", "cancelar"]);
    expect(acciones(hiring(), CLIENT, NOW)).toEqual(["cancelar"]);
    expect(acciones(hiring(), "stranger", NOW)).toEqual([]);
  });

  it("negotiation goes by turns", () => {
    const c = hiring({ status: "negociacion", seq: 2, oferta: { amountCents: 28000, by: DJ } });
    expect(acciones(c, CLIENT, NOW)).toContain("aceptar");
    expect(acciones(c, DJ, NOW)).toEqual(["cancelar"]);
  });

  it("past the deadline the only move left is to expire", () => {
    expect(acciones(hiring(), DJ, NOW + 80 * HOUR)).toEqual(["expirar"]);
  });

  it("a reported deposit stops the clock and freezes the booking", () => {
    const c = hiring({ status: "aceptada", agreedCents: 30000, desglose: desglose(30000) });
    expect(acciones(c, CLIENT, NOW)).toEqual(["reportar_anticipo", "cancelar"]);
    expect(acciones(c, CLIENT, NOW + 80 * HOUR, { anticipoPendiente: true })).toEqual([]);
    expect(acciones(c, DJ, NOW + 80 * HOUR)).toEqual(["expirar"]);
  });

  it("only the client confirms the service, until 7 days have passed", () => {
    const c = confirmed({ event: { ...hiring().event, at: NOW - DAY } });
    expect(acciones(c, CLIENT, NOW)).toEqual(["confirmar_realizada", "abrir_disputa"]);
    expect(acciones(c, DJ, NOW)).toEqual(["abrir_disputa"]);
    expect(acciones(c, DJ, NOW + 7 * DAY)).toEqual(["confirmar_realizada"]);
  });

  it("an open dispute blocks completion", () => {
    const c = confirmed({
      event: { ...hiring().event, at: NOW - DAY },
      disputa: { abierta: true, by: CLIENT, at: NOW, motivo: "no show" },
    });
    expect(acciones(c, CLIENT, NOW)).toEqual([]);
    expect(acciones(c, DJ, NOW + 30 * DAY)).toEqual([]);
  });

  it("nothing is left to do once settled, cancelled or expired", () => {
    for (const status of ["realizada", "liquidada", "cancelada", "expirada"] as const) {
      expect(acciones(hiring({ status }), CLIENT, NOW)).toEqual([]);
    }
  });
});

describe("paso", () => {
  it("accepting freezes the price and its breakdown", () => {
    const c = hiring({ status: "negociacion", seq: 2, oferta: { amountCents: 28000, by: DJ } });
    const p = paso(c, "aceptar", CLIENT, NOW);
    expect(p.to).toBe("aceptada");
    expect(p.patch.agreedCents).toBe(28000);
    expect(p.patch.desglose).toEqual(desglose(28000));
  });

  it("refuses an action that is not available", () => {
    expect(() => paso(hiring(), "aceptar", CLIENT, NOW)).toThrow();
    expect(() => paso(hiring(), "contraofertar", DJ, NOW, { amountCents: 999900 })).toThrow(/between/);
  });

  it("completing creates the pending release of the held deposit", () => {
    const c = confirmed({ event: { ...hiring().event, at: NOW - DAY } });
    const p = paso(c, "confirmar_realizada", CLIENT, NOW);
    expect(p.movimiento).toMatchObject({ tipo: "pago_dj", cents: 3000, userId: DJ });
  });

  it("a late client cancellation pays the DJ; an early one refunds the client", () => {
    const late = paso(confirmed({ event: { ...hiring().event, at: NOW + 2 * DAY } }), "cancelar", CLIENT, NOW);
    expect(late.movimiento).toMatchObject({ tipo: "pago_dj", cents: 3000, userId: DJ });
    const early = paso(confirmed(), "cancelar", CLIENT, NOW);
    expect(early.movimiento).toMatchObject({ tipo: "reembolso", cents: 3000, userId: CLIENT });
    const byDj = paso(confirmed(), "cancelar", DJ, NOW);
    expect(byDj.movimiento).toMatchObject({ tipo: "reembolso", cents: 7500, userId: CLIENT });
  });

  it("cancelling before the deposit moves no money", () => {
    expect(paso(hiring(), "cancelar", CLIENT, NOW).movimiento).toBeUndefined();
  });
});

// The rules are the barrier; this module only predicts them. If the two ever
// disagree, the UI would offer actions the server rejects (or hide valid ones).
describe("parity with firestore.rules", () => {
  const rules = fs.readFileSync(path.resolve("firestore.rules"), "utf8");

  it("uses the same commission and deposit percentages", () => {
    expect(rules).toContain(`n.commissionPct == ${COMMISSION_PCT} && n.depositPct == ${DEPOSIT_PCT}`);
  });

  it("uses the same deadlines", () => {
    for (const [status, byBucket] of Object.entries(PLAZO_HORAS)) {
      const line = new RegExp(`'${status}':\\s*\\{'chico': ${byBucket.chico},\\s*'grande': ${byBucket.grande}\\}`);
      expect(rules).toMatch(line);
    }
  });

  it("uses the same size ranges and buckets", () => {
    for (const [kind, ranges] of Object.entries(SIZE_RANGES)) {
      const map = ranges.map((r) => `'${r.value}': '${r.bucket}'`).join(", ");
      expect(rules).toContain(`'${kind}': {${map}}`);
    }
  });
});
