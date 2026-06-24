"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import {
  getAllUsers,
  setUserStatus,
  getWallet,
  adminCreditWallet,
} from "@/lib/firestore";
import { UserStatus, type User } from "@/types";

const statusStyle: Record<string, string> = {
  [UserStatus.ACTIVE]: "bg-green-500/10 text-green-400 border-green-500/20",
  [UserStatus.PENDING]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  [UserStatus.SUSPENDED]: "bg-red-500/10 text-red-400 border-red-500/20",
  [UserStatus.REJECTED]: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Credit modal ───────────────────────────────────────────────

function CreditModal({
  target,
  onClose,
  onCredited,
}: {
  target: User;
  onClose: () => void;
  onCredited: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Admin credit");
  const [balance, setBalance] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getWallet(target.id)
      .then((w) => setBalance(w?.balance ?? 0))
      .catch(() => setBalance(0));
  }, [target.id]);

  async function handleSubmit() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminCreditWallet({
        userId: target.id,
        amount: parsed,
        description: description.trim() || "Admin credit",
      });
      onCredited();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to credit account.");
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
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white">Credit account</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition" aria-label="Close">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-5">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary-light">
            {target.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{target.name}</p>
            <p className="text-xs text-slate-500 truncate">{target.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Balance</p>
            <p className="text-sm font-bold text-white">
              {balance === null ? "…" : `$${formatCurrency(balance)}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              placeholder="e.g. Promotional credit"
              className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
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
              {saving ? "Crediting…" : "Add credit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────

function AccountsContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creditTarget, setCreditTarget] = useState<User | null>(null);
  const [toast, setToast] = useState("");

  function refresh() {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function changeStatus(u: User, status: UserStatus) {
    setBusyId(u.id);
    try {
      await setUserStatus(u.id, status);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status } : x)));
      flash(`${u.name} is now ${status}.`);
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="min-h-screen bg-background-dark relative">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Accounts</h1>
          <p className="text-gray-500">Approve accounts and credit wallets.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or role…"
            className="w-full rounded-xl bg-surface-input border border-white/10 pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <span className="material-icons text-4xl text-primary animate-spin">refresh</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-icons text-4xl text-slate-700 mb-2 block">group_off</span>
            <p className="text-slate-500">No accounts found.</p>
          </div>
        ) : (
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const busy = busyId === u.id;
                    return (
                      <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-light shrink-0">
                              {u.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">{u.name}</p>
                              <p className="text-xs text-gray-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {u.role}
                          {u.isSuperUser && (
                            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400">super</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusStyle[u.status] || statusStyle[UserStatus.PENDING]}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {u.status !== UserStatus.ACTIVE && (
                              <button
                                onClick={() => changeStatus(u, UserStatus.ACTIVE)}
                                disabled={busy}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                            {u.status === UserStatus.ACTIVE && (
                              <button
                                onClick={() => changeStatus(u, UserStatus.SUSPENDED)}
                                disabled={busy}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50"
                              >
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() => setCreditTarget(u)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary-light border border-primary/20 hover:bg-primary/20 transition flex items-center gap-1"
                            >
                              <span className="material-icons text-sm">add_card</span>
                              Credit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {creditTarget && (
        <CreditModal
          target={creditTarget}
          onClose={() => setCreditTarget(null)}
          onCredited={() => flash(`Credited ${creditTarget.name}.`)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-surface-dark border border-primary/30 text-sm text-white shadow-glow flex items-center gap-2">
          <span className="material-icons text-green-400 text-base">check_circle</span>
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AdminAccountsPage() {
  return (
    <AdminLayout>
      <AccountsContent />
    </AdminLayout>
  );
}
