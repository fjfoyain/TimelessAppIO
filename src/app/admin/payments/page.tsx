"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { useAuth } from "@/contexts/AuthContext";
import BookingsQueue from "@/components/admin/BookingsQueue";
import {
  getAllUsers,
  getPayoutMethod,
  getPendingTransactions,
  getWallet,
  resolveTransaction,
} from "@/lib/firestore";
import type { PayoutMethod, Transaction, User } from "@/types";

function money(n: number): string {
  return Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysWaiting(createdAt?: string): number {
  if (!createdAt) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000));
}

function destination(method: PayoutMethod | null | undefined): string {
  if (method === undefined) return "…";
  if (method?.bank) {
    return `${method.bank.bankName} · ${method.bank.accountNumber} · ${method.bank.accountHolder}`;
  }
  if (method?.wallet) return `${method.wallet.provider} · ${method.wallet.handle}`;
  return "No payout method on file";
}

type Tab = "deposit" | "withdrawal";

function PaymentsContent() {
  const { user: admin } = useAuth();
  const [pending, setPending] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [payouts, setPayouts] = useState<Record<string, PayoutMethod | null>>({});
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("deposit");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<{ tx: Transaction; decision: "completed" | "rejected" } | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [txs, allUsers] = await Promise.all([getPendingTransactions(), getAllUsers()]);
      setPending(txs.filter((t) => !t.contratacionId));
      setUsers(Object.fromEntries(allUsers.map((u) => [u.id, u])));

      // A withdrawal needs its destination and the balance that must cover it.
      const owners = Array.from(new Set(txs.filter((t) => t.type === "withdrawal").map((t) => t.userId)));
      const details = await Promise.all(
        owners.map(async (uid) => [uid, await getPayoutMethod(uid), (await getWallet(uid))?.balance ?? 0] as const)
      );
      setPayouts(Object.fromEntries(details.map(([uid, method]) => [uid, method])));
      setBalances(Object.fromEntries(details.map(([uid, , balance]) => [uid, balance])));
    } catch {
      setError("Pending payments could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rows = useMemo(() => pending.filter((t) => t.type === tab), [pending, tab]);
  const totals = useMemo(() => {
    const sum = (type: Tab) =>
      pending.filter((t) => t.type === type).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const count = (type: Tab) => pending.filter((t) => t.type === type).length;
    return {
      deposit: { sum: sum("deposit"), count: count("deposit") },
      withdrawal: { sum: sum("withdrawal"), count: count("withdrawal") },
    };
  }, [pending]);

  async function resolve() {
    if (!confirming || !admin) return;
    const { tx, decision } = confirming;
    setBusyId(tx.id);
    setError("");
    try {
      await resolveTransaction(tx.id, decision, { id: admin.id, name: admin.name });
      setConfirming(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The payment could not be resolved.");
      setConfirming(null);
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { id: Tab; label: string; hint: string; icon: string }[] = [
    { id: "deposit", label: "Incoming", hint: "Deposits to confirm received", icon: "south_west" },
    { id: "withdrawal", label: "Outgoing", hint: "Withdrawals to send", icon: "north_east" },
  ];

  return (
    <div className="min-h-screen bg-background-dark relative">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Payments to verify</h1>
          <p className="text-gray-500">
            A balance only changes here. Verify a deposit once the money has arrived; verify a
            withdrawal once you have sent it.
          </p>
        </div>

        <BookingsQueue />

        <h2 className="text-lg font-semibold text-white mb-1">Wallet requests</h2>
        <p className="text-sm text-gray-500 mb-4">Deposits and withdrawals users asked for.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`text-left rounded-2xl border p-5 transition-colors ${
                tab === t.id
                  ? "border-primary/40 bg-primary/10"
                  : "border-white/5 bg-surface-dark/50 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="material-icons text-base text-primary-light" aria-hidden="true">{t.icon}</span>
                  {t.label}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {totals[t.id].count} waiting
                </span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums">${money(totals[t.id].sum)}</p>
              <p className="text-xs text-gray-500 mt-1">{t.hint}</p>
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <span className="material-icons text-4xl text-primary animate-spin mb-3 block">hourglass_empty</span>
              <p className="text-sm text-gray-500">Loading payments...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-icons text-4xl text-green-400 mb-3 block">task_alt</span>
              <p className="text-sm text-gray-400">
                Nothing waiting. {tab === "deposit" ? "No deposits to confirm." : "No withdrawals to send."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                    <th className="px-5 py-3 font-medium">Requested</th>
                    <th className="px-5 py-3 font-medium">Account</th>
                    <th className="px-5 py-3 font-medium">{tab === "deposit" ? "Paid by" : "Send to"}</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                    <th className="px-5 py-3 font-medium text-right">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((tx) => {
                    const owner = users[tx.userId];
                    const waiting = daysWaiting(tx.createdAt);
                    const balance = balances[tx.userId] ?? 0;
                    const uncovered = tab === "withdrawal" && balance < Math.abs(tx.amount);
                    const noDestination = tab === "withdrawal" && payouts[tx.userId] === null;
                    return (
                      <tr key={tx.id} className="border-b border-white/5 last:border-0 align-top">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-gray-300">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </p>
                          <p className={`text-xs mt-0.5 ${waiting > 7 ? "text-amber-400" : "text-gray-600"}`}>
                            {waiting === 0 ? "today" : `${waiting} day${waiting === 1 ? "" : "s"} waiting`}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-white font-medium">{owner?.name ?? "Unknown account"}</p>
                          <p className="text-xs text-gray-500">{owner?.email ?? tx.userId}</p>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          {tab === "deposit" ? (
                            <p className="text-gray-300">{tx.source === "cash" ? "Cash" : "Bank transfer"}</p>
                          ) : (
                            <p className={noDestination ? "text-red-300" : "text-gray-300"}>
                              {destination(payouts[tx.userId])}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-0.5 break-words">{tx.description}</p>
                          {tab === "withdrawal" && (
                            <p className={`text-xs mt-0.5 ${uncovered ? "text-red-300" : "text-gray-600"}`}>
                              Balance ${money(balance)}{uncovered ? " — does not cover this withdrawal" : ""}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-white tabular-nums whitespace-nowrap">
                          ${money(tx.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setConfirming({ tx, decision: "rejected" })}
                              disabled={busyId === tx.id}
                              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-white/25 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => setConfirming({ tx, decision: "completed" })}
                              disabled={busyId === tx.id || uncovered || noDestination}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-xs font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {tab === "deposit" ? "Mark received" : "Mark sent"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setConfirming(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-title" className="text-lg font-bold text-white mb-2">
              {confirming.decision === "rejected"
                ? "Reject this request?"
                : confirming.tx.type === "deposit"
                ? "Confirm the money arrived?"
                : "Confirm the money was sent?"}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {confirming.decision === "rejected"
                ? "The balance stays as it is and the account is notified."
                : confirming.tx.type === "deposit"
                ? `$${money(confirming.tx.amount)} will be added to ${users[confirming.tx.userId]?.name ?? "the account"}'s balance.`
                : `$${money(confirming.tx.amount)} will be deducted from ${users[confirming.tx.userId]?.name ?? "the account"}'s balance.`}{" "}
              This cannot be undone from the app.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={resolve}
                disabled={busyId !== null}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 ${
                  confirming.decision === "rejected" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {busyId ? "Saving..." : confirming.decision === "rejected" ? "Reject" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <AdminLayout>
      <PaymentsContent />
    </AdminLayout>
  );
}
