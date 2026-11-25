"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DesgloseCard from "./DesgloseCard";
import {
  ESTADO_LABELS,
  EVENT_KINDS,
  PASOS,
  SIZE_KIND_LABELS,
  SIZE_RANGES,
  acciones,
  dollars,
  ofertaError,
  offerBounds,
  repartoCancelacion,
  rolDe,
  venceEn,
  type Contratacion,
  type Estado,
  type Transicion,
} from "@/lib/contratacion";
import { ejecutar, hasReview, reportarAnticipo, resenar, type Movimiento, type MovimientoTipo } from "@/lib/contrataciones";

const ended: Estado[] = ["cancelada", "expirada"];

function when(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function remaining(ms: number): string {
  if (ms <= 0) return "now";
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 48) return `${Math.floor(hours / 24)} days`;
  if (hours >= 1) return `${hours} h`;
  return `${Math.max(1, Math.floor(ms / 60_000))} min`;
}

// ─── Progress ────────────────────────────────────────────────────

function Stepper({ c }: { c: Contratacion }) {
  const over = ended.includes(c.status);
  // A hiring that ended early keeps showing how far it got.
  const reached = over ? PASOS.indexOf(c.agreedCents ? "aceptada" : "solicitada") : PASOS.indexOf(c.status);
  return (
    <ol className="grid grid-cols-6 gap-1" aria-label="Booking progress">
      {PASOS.map((step, i) => {
        const done = i < reached || (i === reached && c.status === "liquidada");
        const current = i === reached && !over && c.status !== "liquidada";
        return (
          <li key={step} aria-current={current ? "step" : undefined} className="min-w-0">
            <div
              className={`h-1.5 rounded-full ${
                done ? "bg-primary" : current ? "bg-primary/60 animate-pulse" : "bg-white/10"
              }`}
            />
            <p
              className={`mt-2 text-[10px] sm:text-[11px] font-medium truncate ${
                current ? "text-white" : done ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {ESTADO_LABELS[step]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

// ─── What happens next, in words ─────────────────────────────────

function headline(c: Contratacion, rol: "cliente" | "dj", mov: Partial<Record<MovimientoTipo, Movimiento>>, now: number) {
  const other = rol === "cliente" ? c.talentName : c.clientName;
  const myTurn = c.oferta.by !== (rol === "cliente" ? c.clientId : c.talentId);
  switch (c.status) {
    case "solicitada":
      return rol === "dj"
        ? `${c.clientName} wants to book you. Accept the offer, counter it or decline.`
        : `Waiting for ${other} to answer your request.`;
    case "negociacion":
      return myTurn ? `${other} proposed ${dollars(c.oferta.amountCents)}. Your move.` : `Waiting for ${other} to answer your offer.`;
    case "aceptada":
      if (mov.anticipo?.status === "processing") return "Deposit reported. Timeless is verifying that it arrived.";
      if (mov.anticipo?.status === "rejected")
        return rol === "cliente" ? "We could not find your deposit. Check the reference and report it again." : "The client's deposit could not be verified yet.";
      return rol === "cliente"
        ? `Price agreed. Pay the ${dollars(c.desglose?.depositCents ?? 0)} deposit to lock in the date.`
        : `Price agreed. Waiting for ${other} to pay the deposit.`;
    case "confirmada":
      if (c.disputa?.abierta) return "A dispute is open. Timeless is reviewing it.";
      if (now < c.event.at) return "Confirmed. The date is locked in.";
      return rol === "cliente"
        ? "The event has taken place. Confirm that the service was delivered."
        : `Waiting for ${other} to confirm the service. It completes on its own 7 days after the event.`;
    case "realizada":
      return "Service completed. Timeless is releasing the held deposit to the DJ.";
    case "liquidada":
      return "Settled. Everything owed has been paid.";
    case "cancelada":
      return `Cancelled${c.cancelacion ? ` by ${c.cancelacion.rol === "admin" ? "Timeless" : c.cancelacion.rol === rol ? "you" : other}` : ""}.`;
    case "expirada":
      return "Expired: a deadline passed without a reply.";
  }
}

// ─── Money owed through Timeless ─────────────────────────────────

function Movimientos({ c, mov }: { c: Contratacion; mov: Partial<Record<MovimientoTipo, Movimiento>> }) {
  const rows: { label: string; to: string; m?: Movimiento }[] = [
    { label: "Deposit", to: "Client → Timeless", m: mov.anticipo },
    { label: "Held deposit", to: `Timeless → ${c.talentName}`, m: mov.pago_dj },
    { label: "Refund", to: `Timeless → ${c.clientName}`, m: mov.reembolso },
  ].filter((r) => r.m);
  if (rows.length === 0) return null;

  const badge: Record<string, string> = {
    processing: "text-yellow-400 bg-yellow-400/10",
    completed: "text-green-400 bg-green-400/10",
    rejected: "text-red-400 bg-red-400/10",
  };
  const text: Record<string, string> = { processing: "In review", completed: "Done", rejected: "Not verified" };

  return (
    <section aria-label="Payments through Timeless">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Through Timeless</h3>
      <ul className="rounded-xl border border-white/10 divide-y divide-white/5">
        {rows.map(({ label, to, m }) => (
          <li key={label} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm text-white">{label}</p>
              <p className="text-[11px] text-slate-500 truncate">{to}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-white tabular-nums">{dollars(m!.amountCents)}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badge[m!.status] ?? "text-slate-400 bg-white/5"}`}>
                {text[m!.status] ?? m!.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── History ─────────────────────────────────────────────────────

function Historial({ c, items }: { c: Contratacion; items: Transicion[] }) {
  const who = (t: Transicion) => (t.rol === "admin" ? "Timeless" : t.by === c.clientId ? c.clientName : c.talentName);
  const what = (t: Transicion): string => {
    switch (t.kind) {
      case "solicitud":
        return `requested the booking at ${dollars(t.offerCents ?? c.listCents)}`;
      case "oferta":
        return `proposed ${dollars(t.offerCents ?? 0)}`;
      case "aceptacion":
        return "accepted the price";
      case "confirmacion":
        return "verified the deposit";
      case "disputa":
        return t.rol === "admin" ? "closed the dispute" : "opened a dispute";
      case "realizacion":
        return "marked the service as completed";
      case "liquidacion":
        return "released the held deposit";
      case "cancelacion":
        return "cancelled the booking";
      case "expiracion":
        return "closed it as expired";
    }
  };
  return (
    <section aria-label="History">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3">History</h3>
      <ol className="relative border-l border-white/10 ml-1.5 space-y-4">
        {items.map((t) => (
          <li key={t.seq} className="pl-4 relative">
            <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/70 ring-4 ring-background-dark" aria-hidden="true" />
            <p className="text-sm text-slate-200">
              <span className="font-semibold text-white">{who(t)}</span> {what(t)}
            </p>
            {t.motivo && <p className="text-xs text-slate-400 mt-0.5">“{t.motivo}”</p>}
            <p className="text-[11px] text-slate-600 mt-0.5 tabular-nums">{t.at ? when(t.at) : "just now"}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── Review ──────────────────────────────────────────────────────

function Resena({ c, uid }: { c: Contratacion; uid: string }) {
  const [state, setState] = useState<"loading" | "open" | "done">("loading");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    hasReview(c.id)
      .then((exists) => setState(exists ? "done" : "open"))
      .catch(() => setState("open"));
  }, [c.id]);

  if (state === "loading") return null;
  if (state === "done") return <p className="text-xs text-slate-500">Thanks — your review is on {c.talentName}&apos;s profile.</p>;

  return (
    <section aria-label="Review" className="rounded-xl border border-white/10 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white">Rate {c.talentName}</h3>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} role="radio" aria-checked={rating === n} aria-label={`${n} star${n === 1 ? "" : "s"}`} onClick={() => setRating(n)}>
            <span className={`material-icons ${n <= rating ? "text-yellow-400" : "text-slate-700"}`} aria-hidden="true">star</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="How did it go?"
        className="w-full rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await resenar(c, uid, rating, comment);
            setState("done");
          } finally {
            setBusy(false);
          }
        }}
        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition disabled:opacity-50"
      >
        {busy ? "Sending..." : "Publish review"}
      </button>
    </section>
  );
}

// ─── Panel ───────────────────────────────────────────────────────

type Dialog = "counter" | "cancel" | "dispute" | "deposit" | null;

export default function ContratacionPanel({
  c,
  transiciones,
  movimientos,
  uid,
}: {
  c: Contratacion;
  transiciones: Transicion[];
  movimientos: Partial<Record<MovimientoTipo, Movimiento>>;
  uid: string;
}) {
  const rol = rolDe(c, uid);
  // Deadlines are evaluated when someone looks: tick so the screen does not
  // keep offering an action whose time has passed.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const [dialog, setDialog] = useState<Dialog>(null);
  const [amount, setAmount] = useState("");
  const [motivo, setMotivo] = useState("");
  const [source, setSource] = useState<"manual_transfer" | "cash">("manual_transfer");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!rol) return null;

  const anticipoPendiente = movimientos.anticipo?.status === "processing";
  const can = acciones(c, uid, now, { anticipoPendiente });
  const deadline = anticipoPendiente ? null : venceEn(c);
  const priceCents = c.agreedCents ?? c.oferta.amountCents;
  const eventType = EVENT_KINDS.find((k) => k.value === c.event.type)?.label ?? c.event.type;
  const size = SIZE_RANGES[c.event.sizeKind]?.find((r) => r.value === c.event.sizeRange)?.label ?? c.event.sizeRange;
  const { minCents, maxCents } = offerBounds(c.listCents);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
      setDialog(null);
      setAmount("");
      setMotivo("");
      setReference("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const amountCents = Math.round(parseFloat(amount) * 100);
  const counterProblem = amount === "" ? "" : ofertaError(amountCents, c.listCents);

  // What cancelling a confirmed booking costs, said before the click.
  const cancelCost = (() => {
    if (c.status !== "confirmada" || !c.desglose) return "No money has moved, so nothing is owed.";
    const r = repartoCancelacion(c, rol, now);
    if (rol === "dj") return `The client recovers the whole ${dollars(r.clienteCents)} deposit.`;
    return r.clienteCents > 0
      ? `You recover ${dollars(r.clienteCents)}. The ${dollars(r.timelessCents)} commission is not refunded.`
      : `It is 7 days or less to the event: the deposit is not refunded and ${c.talentName} keeps ${dollars(r.djCents)} for the blocked date.`;
  })();

  const primary = "px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition disabled:opacity-50";
  const secondary = "px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-200 hover:border-white/25 transition disabled:opacity-50";
  const field = "w-full rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Status */}
        <section className="rounded-2xl border border-white/10 bg-surface-dark/50 backdrop-blur-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">
                {rol === "cliente" ? `Booking ${c.talentName}` : `Booking from ${c.clientName}`}
              </p>
              <h1 className="text-2xl font-bold text-white truncate">{c.plan.title}</h1>
            </div>
            <span
              className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${
                ended.includes(c.status)
                  ? "text-slate-400 border-white/10 bg-white/5"
                  : "text-primary-light border-primary/30 bg-primary/10"
              }`}
            >
              {ESTADO_LABELS[c.status]}
            </span>
          </div>

          <Stepper c={c} />

          <div>
            <p className="text-sm text-slate-200" aria-live="polite">{headline(c, rol, movimientos, now)}</p>
            {deadline !== null && !ended.includes(c.status) && (
              <p className={`text-xs mt-1 ${deadline - now < 12 * 3_600_000 ? "text-amber-400" : "text-slate-500"}`}>
                {deadline > now ? `Expires in ${remaining(deadline - now)} if nothing happens.` : "The deadline has passed."}
              </p>
            )}
          </div>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          {/* Actions */}
          {can.length > 0 && dialog === null && (
            <div className="flex flex-wrap gap-3">
              {can.includes("aceptar") && (
                <button disabled={busy} onClick={() => run(() => ejecutar(c.id, "aceptar", uid))} className={primary}>
                  Accept {dollars(c.oferta.amountCents)}
                </button>
              )}
              {can.includes("reportar_anticipo") && (
                <button disabled={busy} onClick={() => setDialog("deposit")} className={primary}>
                  I paid the {dollars(c.desglose?.depositCents ?? 0)} deposit
                </button>
              )}
              {can.includes("confirmar_realizada") && (
                <button disabled={busy} onClick={() => run(() => ejecutar(c.id, "confirmar_realizada", uid))} className={primary}>
                  {rol === "cliente" ? "Confirm the service was delivered" : "Mark as completed"}
                </button>
              )}
              {can.includes("contraofertar") && (
                <button disabled={busy} onClick={() => setDialog("counter")} className={secondary}>
                  Counter-offer
                </button>
              )}
              {can.includes("abrir_disputa") && (
                <button disabled={busy} onClick={() => setDialog("dispute")} className={secondary}>
                  Report a problem
                </button>
              )}
              {can.includes("expirar") && (
                <button disabled={busy} onClick={() => run(() => ejecutar(c.id, "expirar", uid))} className={secondary}>
                  Close as expired
                </button>
              )}
              {can.includes("cancelar") && (
                <button disabled={busy} onClick={() => setDialog("cancel")} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-300 transition">
                  {c.status === "solicitada" && rol === "dj" ? "Decline" : "Cancel booking"}
                </button>
              )}
            </div>
          )}

          {dialog === "counter" && (
            <div className="space-y-3 rounded-xl border border-white/10 p-4">
              <label htmlFor="counter" className="block text-sm font-medium text-slate-300">Your counter-offer (USD)</label>
              <input id="counter" type="number" inputMode="numeric" step="1" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
              <p className={`text-[11px] ${counterProblem ? "text-red-400" : "text-slate-500"}`}>
                {counterProblem || `Between ${dollars(minCents)} and ${dollars(maxCents)}, in whole dollars.`}
              </p>
              {amount !== "" && !counterProblem && <DesgloseCard priceCents={amountCents} label="Your offer" perspective={rol} />}
              <div className="flex gap-3">
                <button onClick={() => setDialog(null)} className={secondary}>Back</button>
                <button
                  disabled={busy || amount === "" || !!counterProblem}
                  onClick={() => run(() => ejecutar(c.id, "contraofertar", uid, { amountCents }))}
                  className={primary}
                >
                  Send offer
                </button>
              </div>
            </div>
          )}

          {dialog === "deposit" && c.desglose && (
            <div className="space-y-3 rounded-xl border border-white/10 p-4">
              <p className="text-sm text-slate-300">
                Send <span className="font-semibold text-white">{dollars(c.desglose.depositCents)}</span> to Timeless and tell us how. The booking is confirmed when we see it arrive.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["manual_transfer", "cash"] as const).map((s) => (
                  <button key={s} type="button" aria-pressed={source === s} onClick={() => setSource(s)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${source === s ? "border-primary/50 bg-primary/15 text-white" : "border-white/10 text-slate-400"}`}>
                    {s === "cash" ? "Cash" : "Bank transfer"}
                  </button>
                ))}
              </div>
              <label htmlFor="reference" className="block text-sm font-medium text-slate-300">Reference</label>
              <input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} maxLength={120}
                placeholder={source === "cash" ? "Who received it and when" : "Transfer or receipt number"} className={field} />
              <div className="flex gap-3">
                <button onClick={() => setDialog(null)} className={secondary}>Back</button>
                <button disabled={busy || !reference.trim()} onClick={() => run(() => reportarAnticipo(c, uid, { source, reference }))} className={primary}>
                  Report deposit
                </button>
              </div>
            </div>
          )}

          {(dialog === "cancel" || dialog === "dispute") && (
            <div className="space-y-3 rounded-xl border border-white/10 p-4">
              <p className="text-sm text-slate-300">
                {dialog === "cancel" ? cancelCost : "Tell us what happened. The held deposit stays frozen until Timeless reviews it."}
              </p>
              <label htmlFor="motivo" className="block text-sm font-medium text-slate-300">
                {dialog === "cancel" ? "Reason (optional)" : "What happened"}
              </label>
              <textarea id="motivo" rows={3} maxLength={dialog === "cancel" ? 500 : 1000} value={motivo} onChange={(e) => setMotivo(e.target.value)} className={field} />
              <div className="flex gap-3">
                <button onClick={() => setDialog(null)} className={secondary}>Back</button>
                <button
                  disabled={busy || (dialog === "dispute" && !motivo.trim())}
                  onClick={() => run(() => ejecutar(c.id, dialog === "cancel" ? "cancelar" : "abrir_disputa", uid, { motivo }))}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition disabled:opacity-50"
                >
                  {dialog === "cancel" ? "Cancel booking" : "Open dispute"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Price */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-white">
              {c.agreedCents ? "Agreed price" : "Offer on the table"}
            </h2>
            <p className="text-xs text-slate-500">
              Listed at {dollars(c.listCents)}
              {priceCents !== c.listCents && ` · ${priceCents < c.listCents ? "−" : "+"}${dollars(Math.abs(priceCents - c.listCents))}`}
            </p>
          </div>
          <DesgloseCard priceCents={priceCents} label={c.agreedCents ? "Agreed price" : "Current offer"} perspective={rol} />
        </section>

        {c.reparto && c.status !== "liquidada" && c.status !== "realizada" && (
          <p className="text-xs text-slate-400">
            Deposit outcome: client {dollars(c.reparto.clienteCents)} · Timeless {dollars(c.reparto.timelessCents)} · DJ {dollars(c.reparto.djCents)}.
          </p>
        )}

        <Movimientos c={c} mov={movimientos} />

        {rol === "cliente" && (c.status === "realizada" || c.status === "liquidada") && <Resena c={c} uid={uid} />}
      </div>

      {/* Side: event + history */}
      <aside className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-surface-dark/50 backdrop-blur-xl p-5 space-y-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Event</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">When</dt><dd className="text-white text-right">{when(c.event.at)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Type</dt><dd className="text-white">{eventType}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">{SIZE_KIND_LABELS[c.event.sizeKind]}</dt><dd className="text-white">{size}</dd></div>
          </dl>
          {c.conversationId && (
            <Link href={`/messages?convo=${c.conversationId}`} className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5 transition">
              <span className="material-icons text-sm" aria-hidden="true">forum</span>
              Open chat
            </Link>
          )}
        </section>

        {c.disputa && (
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-2">
              Dispute {c.disputa.abierta ? "open" : "closed"}
            </h2>
            <p className="text-sm text-slate-200">“{c.disputa.motivo}”</p>
          </section>
        )}

        <div className="rounded-2xl border border-white/10 bg-surface-dark/50 backdrop-blur-xl p-5">
          <Historial c={c} items={transiciones} />
        </div>
      </aside>
    </div>
  );
}
