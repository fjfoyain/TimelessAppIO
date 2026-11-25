"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getPendingTransactions } from "@/lib/firestore";
import {
  expirarComoAdmin,
  getAllContrataciones,
  liquidarMovimiento,
  rechazarAnticipo,
  resolverDisputa,
  verificarAnticipo,
} from "@/lib/contrataciones";
import { dollars, estaVencida, type Contratacion } from "@/lib/contratacion";
import type { Transaction } from "@/types";

type Tab = "anticipos" | "pagos" | "disputas" | "vencidas";

// Everything in the booking flow that waits for Timeless: deposits to verify,
// held deposits and refunds to pay out, disputes to resolve, and bookings
// whose deadline passed with nobody closing them.
export default function BookingsQueue() {
  const { user: admin } = useAuth();
  const [pending, setPending] = useState<Transaction[]>([]);
  const [hirings, setHirings] = useState<Record<string, Contratacion>>({});
  const [tab, setTab] = useState<Tab>("anticipos");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [txs, all] = await Promise.all([getPendingTransactions(), getAllContrataciones()]);
      setPending(txs.filter((t) => t.contratacionId));
      setHirings(Object.fromEntries(all.map((c) => [c.id, c])));
    } catch {
      setError("The bookings queue could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const now = Date.now();
  const anticipos = pending.filter((t) => t.type === "payment");
  const pagos = pending.filter((t) => t.type === "payout" || t.type === "refund");
  const disputas = Object.values(hirings).filter((c) => c.status === "confirmada" && c.disputa?.abierta);
  const waitingDeposit = new Set(anticipos.map((t) => t.contratacionId));
  const vencidas = Object.values(hirings).filter((c) => estaVencida(c, now) && !waitingDeposit.has(c.id));

  const tabs: { id: Tab; label: string; count: number; hint: string }[] = [
    { id: "anticipos", label: "Deposits", count: anticipos.length, hint: "Confirm the client's deposit arrived" },
    { id: "pagos", label: "Payouts & refunds", count: pagos.length, hint: "Release held deposits and refunds" },
    { id: "disputas", label: "Disputes", count: disputas.length, hint: "Decide who is right" },
    { id: "vencidas", label: "Overdue", count: vencidas.length, hint: "Past their deadline, still open" },
  ];

  async function act(key: string, fn: (actor: { id: string; name: string }) => Promise<void>) {
    if (!admin) return;
    setBusy(key);
    setError("");
    try {
      await fn({ id: admin.id, name: admin.name });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not go through.");
    } finally {
      setBusy(null);
    }
  }

  const ok = "px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-xs font-semibold text-white transition disabled:opacity-40";
  const plain = "px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-white/25 transition disabled:opacity-40";

  const who = (c?: Contratacion) =>
    c ? (
      <Link href={`/contrataciones/${c.id}`} className="hover:underline">
        <span className="text-white font-medium">{c.plan.title}</span>
        <span className="block text-xs text-gray-500">{c.clientName} → {c.talentName}</span>
      </Link>
    ) : (
      <span className="text-gray-500">Unknown booking</span>
    );

  const empty = (text: string) => (
    <div className="py-12 text-center">
      <span className="material-icons text-3xl text-green-400 mb-2 block" aria-hidden="true">task_alt</span>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );

  const row = (key: string, left: React.ReactNode, middle: React.ReactNode, actions: React.ReactNode) => (
    <li key={key} className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-4">
      <div className="md:w-1/3 min-w-0 text-sm">{left}</div>
      <div className="flex-1 min-w-0 text-sm text-gray-300">{middle}</div>
      <div className="flex gap-2 md:justify-end shrink-0">{actions}</div>
    </li>
  );

  return (
    <section aria-label="Bookings queue" className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-1">Bookings</h2>
      <p className="text-sm text-gray-500 mb-4">What the booking flow is waiting on you for.</p>

      <div className="flex flex-wrap gap-2 mb-4" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            title={t.hint}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
              tab === t.id ? "border-primary/40 bg-primary/10 text-white" : "border-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
            <span className={`ml-2 text-xs tabular-nums ${t.count > 0 ? "text-amber-400" : "text-gray-600"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <span className="material-icons text-3xl text-primary animate-spin" aria-hidden="true">hourglass_empty</span>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {tab === "anticipos" &&
              (anticipos.length === 0
                ? empty("No deposits to verify.")
                : anticipos.map((t) => {
                    const c = hirings[t.contratacionId ?? ""];
                    return row(
                      t.id,
                      who(c),
                      <>
                        <span className="font-semibold text-white tabular-nums">{dollars(t.amountCents ?? 0)}</span>
                        {" · "}
                        {t.source === "cash" ? "Cash" : "Bank transfer"}
                        <span className="block text-xs text-gray-500 break-words">
                          Ref: {(t as Transaction & { reference?: string }).reference || "—"}
                        </span>
                      </>,
                      <>
                        <button disabled={busy !== null} onClick={() => act(t.id, (a) => rechazarAnticipo(t.contratacionId!, a))} className={plain}>
                          Not found
                        </button>
                        <button disabled={busy !== null} onClick={() => act(t.id, (a) => verificarAnticipo(t.contratacionId!, a))} className={ok}>
                          Deposit received
                        </button>
                      </>
                    );
                  }))}

            {tab === "pagos" &&
              (pagos.length === 0
                ? empty("Nothing to pay out.")
                : pagos.map((t) => {
                    const c = hirings[t.contratacionId ?? ""];
                    const tipo = t.type === "payout" ? "pago_dj" : "reembolso";
                    return row(
                      t.id,
                      who(c),
                      <>
                        <span className="font-semibold text-white tabular-nums">{dollars(t.amountCents ?? 0)}</span>
                        {" → "}
                        {tipo === "pago_dj" ? `${c?.talentName ?? "DJ"} (held deposit)` : `${c?.clientName ?? "client"} (refund)`}
                        <span className="block text-xs text-gray-500">Credited to their Timeless balance.</span>
                      </>,
                      <button disabled={busy !== null} onClick={() => act(t.id, (a) => liquidarMovimiento(t.contratacionId!, tipo, a))} className={ok}>
                        Release
                      </button>
                    );
                  }))}

            {tab === "disputas" &&
              (disputas.length === 0
                ? empty("No open disputes.")
                : disputas.map((c) =>
                    row(
                      c.id,
                      who(c),
                      <span className="break-words">“{c.disputa?.motivo}”</span>,
                      <>
                        <button disabled={busy !== null} onClick={() => act(c.id, (a) => resolverDisputa(c.id, "descartar", a))} className={plain}>
                          Dismiss
                        </button>
                        <button disabled={busy !== null} onClick={() => act(c.id, (a) => resolverDisputa(c.id, "cliente", a))} className={plain}>
                          Refund client
                        </button>
                        <button disabled={busy !== null} onClick={() => act(c.id, (a) => resolverDisputa(c.id, "dj", a))} className={ok}>
                          Pay DJ
                        </button>
                      </>
                    )
                  ))}

            {tab === "vencidas" &&
              (vencidas.length === 0
                ? empty("Nothing overdue.")
                : vencidas.map((c) =>
                    row(
                      c.id,
                      who(c),
                      <>Stuck in “{c.status}” past its deadline.</>,
                      <button disabled={busy !== null} onClick={() => act(c.id, (a) => expirarComoAdmin(c.id, a))} className={plain}>
                        Close as expired
                      </button>
                    )
                  ))}
          </ul>
        )}
      </div>
    </section>
  );
}
