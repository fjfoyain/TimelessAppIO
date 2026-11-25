"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useContrataciones } from "@/hooks/useFirestore";
import {
  ESTADO_LABELS,
  acciones,
  dollars,
  rolDe,
  venceEn,
  type Contratacion,
  type Estado,
} from "@/lib/contratacion";

// The board mirrors the real state of each booking. Cards move when the
// booking does — nobody drags them.
const COLUMNS: { title: string; hint: string; states: Estado[] }[] = [
  { title: "Requests", hint: "Waiting for an answer or negotiating", states: ["solicitada", "negociacion"] },
  { title: "Awaiting deposit", hint: "Price agreed, deposit not verified yet", states: ["aceptada"] },
  { title: "Confirmed", hint: "Deposit verified, date locked in", states: ["confirmada"] },
  { title: "Completed", hint: "Service delivered", states: ["realizada", "liquidada"] },
];
const CLOSED: Estado[] = ["cancelada", "expirada"];

function eventDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Card({ c, uid, now, anticipoPendiente }: { c: Contratacion; uid: string; now: number; anticipoPendiente: boolean }) {
  const rol = rolDe(c, uid);
  const other = rol === "cliente" ? c.talentName : c.clientName;
  // "Your move" = there is something to do besides walking away.
  const myMove = acciones(c, uid, now, { anticipoPendiente }).some((a) => a !== "cancelar");
  const deadline = venceEn(c);
  const hoursLeft = deadline === null ? null : Math.floor((deadline - now) / 3_600_000);

  return (
    <Link
      href={`/contrataciones/${c.id}`}
      className="block rounded-xl border border-white/10 bg-background-dark/60 p-4 hover:border-primary/40 transition group"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-white truncate group-hover:text-primary-light transition">{c.plan.title}</p>
        <p className="text-sm font-semibold text-white tabular-nums shrink-0">
          {dollars(c.agreedCents ?? c.oferta.amountCents)}
        </p>
      </div>
      <p className="text-xs text-slate-400 mt-0.5 truncate">
        {rol === "cliente" ? "with" : "for"} {other} · {eventDate(c.event.at)}
      </p>
      <div className="flex items-center justify-between gap-2 mt-3">
        <span className="text-[11px] text-slate-500">{ESTADO_LABELS[c.status]}{c.disputa?.abierta ? " · dispute open" : ""}</span>
        {myMove ? (
          <span className="text-[11px] font-semibold text-primary-light bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5">
            Your move
          </span>
        ) : hoursLeft !== null && hoursLeft >= 0 ? (
          <span className={`text-[11px] tabular-nums ${hoursLeft < 12 ? "text-amber-400" : "text-slate-600"}`}>
            {hoursLeft >= 48 ? `${Math.floor(hoursLeft / 24)}d left` : `${hoursLeft}h left`}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function Content() {
  const { user } = useAuth();
  const { items, loading, waitingDeposit } = useContrataciones(user?.id);
  const [showClosed, setShowClosed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const closed = useMemo(() => items.filter((c) => CLOSED.includes(c.status)), [items]);
  const uid = user?.id ?? "";

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Bookings</h1>
              <p className="text-slate-500 mt-1">Every request you sent or received, by where it stands.</p>
            </div>
            <Link href="/marketplace" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition">
              <span className="material-icons text-sm" aria-hidden="true">search</span>
              Find a DJ
            </Link>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <span className="material-icons text-4xl text-primary animate-spin" aria-hidden="true">refresh</span>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-surface-dark/50 py-20 text-center">
              <span className="material-icons text-4xl text-slate-700" aria-hidden="true">event_available</span>
              <p className="text-white font-semibold mt-3">No bookings yet</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Pick a plan on a DJ&apos;s profile and send a request. It will show up here and move as it progresses.
              </p>
              <Link href="/marketplace" className="inline-block mt-5 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition">
                Browse the marketplace
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {COLUMNS.map((col) => {
                  const cards = items.filter((c) => col.states.includes(c.status));
                  return (
                    <section key={col.title} aria-label={col.title} className="rounded-2xl border border-white/5 bg-surface-dark/40 p-4">
                      <div className="flex items-baseline justify-between mb-1">
                        <h2 className="text-sm font-semibold text-white">{col.title}</h2>
                        <span className="text-xs text-slate-500 tabular-nums">{cards.length}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-3">{col.hint}</p>
                      <div className="space-y-3">
                        {cards.length === 0 ? (
                          <p className="text-xs text-slate-600 py-6 text-center border border-dashed border-white/5 rounded-xl">Nothing here</p>
                        ) : (
                          cards.map((c) => <Card key={c.id} c={c} uid={uid} now={now} anticipoPendiente={waitingDeposit.has(c.id)} />)
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>

              {closed.length > 0 && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowClosed((v) => !v)}
                    aria-expanded={showClosed}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
                  >
                    <span className="material-icons text-base" aria-hidden="true">{showClosed ? "expand_less" : "expand_more"}</span>
                    Cancelled and expired ({closed.length})
                  </button>
                  {showClosed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
                      {closed.map((c) => <Card key={c.id} c={c} uid={uid} now={now} anticipoPendiente={false} />)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
