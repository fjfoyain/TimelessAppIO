"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet, useTransactions } from "@/hooks/useFirestore";
import type { TransactionSource } from "@/types";

const statusColors: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10",
  processing: "text-yellow-400 bg-yellow-400/10",
  pending: "text-slate-400 bg-slate-400/10",
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function txIcon(type: string): string {
  switch (type) {
    case "withdrawal":
    case "payout":
      return "account_balance";
    case "refund":
      return "replay";
    default:
      return "payments";
  }
}

function txLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
}

// ─── Add Funds Modal ────────────────────────────────────────────

function AddFundsModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (amount: number, source: TransactionSource, description: string) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<"manual_transfer" | "cash">("manual_transfer");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!description.trim()) {
      setError("Please add a description.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(parsed, source, description.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add funds.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add Funds</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Payment Source</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSource("manual_transfer")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  source === "manual_transfer"
                    ? "border-primary/40 bg-primary/10 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <span className="material-icons text-lg">account_balance</span>
                <span className="text-xs font-medium">Bank Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setSource("cash")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  source === "cash"
                    ? "border-primary/40 bg-primary/10 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <span className="material-icons text-lg">payments</span>
                <span className="text-xs font-medium">Cash</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Bank deposit, Cash payment"
              maxLength={200}
              className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition disabled:opacity-50"
            >
              {saving ? "Processing..." : "Add Funds"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Withdraw Modal ─────────────────────────────────────────────

function WithdrawModal({
  balance,
  onClose,
  onSubmit,
}: {
  balance: number;
  onClose: () => void;
  onSubmit: (amount: number, description: string) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Withdrawal to bank account");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (parsed > balance) {
      setError(`Insufficient balance. Available: $${formatCurrency(balance)}`);
      return;
    }
    if (!description.trim()) {
      setError("Please add a description.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(parsed, description.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to withdraw.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-sm text-slate-400">Available Balance</span>
            <span className="text-sm font-bold text-white">${formatCurrency(balance)}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Withdrawal reason"
              maxLength={200}
              className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition disabled:opacity-50"
            >
              {saving ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wallet Content ─────────────────────────────────────────────

function WalletContent() {
  const { user } = useAuth();
  const { wallet, loading: walletLoading, addFunds, withdraw } = useWallet(user?.id);
  const { transactions, loading: txLoading } = useTransactions(user?.id);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const balance = wallet?.balance ?? 0;
  const escrow = wallet?.escrow ?? 0;
  const recentTx = transactions.slice(0, 5);
  const loading = walletLoading || txLoading;

  // Compute breakdowns from real transactions
  const deposits = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const withdrawals = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const pending = transactions.filter((t) => t.status === "pending" || t.status === "processing").reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <span className="material-icons text-5xl text-primary animate-pulse">account_balance_wallet</span>
            <p className="text-slate-500 mt-4">Loading wallet...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Wallet</h1>
              <p className="text-slate-500 mt-1">
                Manage your earnings, payouts, and payment methods.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/wallet/transactions"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
              >
                <span className="material-icons text-sm">receipt_long</span>
                Statement
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary-dark/20 to-background-dark border border-primary/20 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                <div className="relative">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                    Total Balance
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-white">${formatCurrency(balance)}</p>
                  {escrow > 0 && (
                    <p className="text-yellow-400 text-sm mt-2">
                      ${formatCurrency(escrow)} in escrow
                    </p>
                  )}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddFunds(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow"
                    >
                      <span className="material-icons text-sm">add</span>
                      Add Funds
                    </button>
                    <button
                      onClick={() => setShowWithdraw(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition"
                    >
                      <span className="material-icons text-sm">account_balance</span>
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <span className="material-icons text-green-400 text-sm">arrow_downward</span>
                    <span className="text-xs font-medium uppercase tracking-wider">Total Deposits</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${formatCurrency(deposits)}</p>
                </div>
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <span className="material-icons text-primary text-sm">arrow_upward</span>
                    <span className="text-xs font-medium uppercase tracking-wider">Total Withdrawals</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${formatCurrency(withdrawals)}</p>
                </div>
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <span className="material-icons text-yellow-400 text-sm">schedule</span>
                    <span className="text-xs font-medium uppercase tracking-wider">Processing</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${formatCurrency(pending)}</p>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">Transaction History</h3>
                  <Link
                    href="/wallet/transactions"
                    className="text-primary text-sm font-medium hover:text-primary-light transition"
                  >
                    View All
                  </Link>
                </div>
                {recentTx.length === 0 ? (
                  <div className="p-10 text-center">
                    <span className="material-icons text-4xl text-slate-700 mb-3">receipt_long</span>
                    <p className="text-slate-500">No transactions yet.</p>
                    <p className="text-xs text-slate-600 mt-1">Add funds to get started.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentTx.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-icons text-primary text-sm">{txIcon(tx.type)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{tx.description}</p>
                            <p className="text-xs text-slate-500">{formatDate(tx.createdAt)} &middot; {txLabel(tx.type)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${tx.amount > 0 ? "text-green-400" : "text-white"}`}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount < 0 ? "-" : ""}${formatCurrency(Math.abs(tx.amount))}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[tx.status] || "text-slate-400 bg-slate-400/10"}`}>
                            {txLabel(tx.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <span className="material-icons text-green-400 text-sm">account_balance</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Manual Bank Transfer</p>
                      <p className="text-xs text-slate-500">In-person or wire transfer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-icons text-primary text-sm">payments</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Cash Payment</p>
                      <p className="text-xs text-slate-500">Pay in person</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <span className="material-icons text-blue-400 text-sm">credit_card</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Credit / Debit Card</p>
                      <p className="text-xs text-slate-500">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddFunds(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"
                  >
                    <span className="material-icons text-primary">add_circle</span>
                    <span className="text-sm text-white font-medium">Add Funds</span>
                  </button>
                  <button
                    onClick={() => setShowWithdraw(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"
                  >
                    <span className="material-icons text-primary">request_quote</span>
                    <span className="text-sm text-white font-medium">Withdraw</span>
                  </button>
                  <Link
                    href="/wallet/transactions"
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"
                  >
                    <span className="material-icons text-primary">history</span>
                    <span className="text-sm text-white font-medium">Full History</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {showAddFunds && (
        <AddFundsModal
          onClose={() => setShowAddFunds(false)}
          onSubmit={addFunds}
        />
      )}
      {showWithdraw && (
        <WithdrawModal
          balance={balance}
          onClose={() => setShowWithdraw(false)}
          onSubmit={withdraw}
        />
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}
