"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getPayoutMethod, savePayoutMethod } from "@/lib/firestore";
import type { PayoutMethod } from "@/types";

const WALLET_PROVIDERS = ["paypal", "stripe", "binance", "metamask", "other"] as const;
type WalletProvider = (typeof WALLET_PROVIDERS)[number];

function PayoutsContent() {
  const { user } = useAuth();

  // Bank fields
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");

  // Wallet fields
  const [walletProvider, setWalletProvider] = useState<WalletProvider>("paypal");
  const [walletHandle, setWalletHandle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getPayoutMethod(user.id)
      .then((m) => {
        if (m?.bank) {
          setAccountHolder(m.bank.accountHolder || "");
          setBankName(m.bank.bankName || "");
          setAccountNumber(m.bank.accountNumber || "");
          setIdNumber(m.bank.idNumber || "");
        }
        if (m?.wallet) {
          setWalletProvider(m.wallet.provider as WalletProvider);
          setWalletHandle(m.wallet.handle || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMsg(null);
    try {
      const data: Omit<PayoutMethod, "userId" | "updatedAt"> = {};
      if (accountHolder.trim() && bankName.trim() && accountNumber.trim()) {
        data.bank = {
          accountHolder: accountHolder.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          idNumber: idNumber.trim() || undefined,
        };
      }
      if (walletHandle.trim()) {
        data.wallet = {
          provider: walletProvider,
          handle: walletHandle.trim(),
        };
      }
      if (!data.bank && !data.wallet) {
        setMsg({ type: "error", text: "Add a bank account or a wallet handle." });
        setSaving(false);
        return;
      }
      await savePayoutMethod(user.id, data);
      setMsg({ type: "success", text: "Payout details saved." });
    } catch (err) {
      setMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Couldn't save payout details.",
      });
    } finally {
      setSaving(false);
    }
  }

  const inputBase =
    "w-full rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Payout Methods
            </h1>
            <p className="text-slate-500 mt-1">
              How you&apos;d like to receive payments once an event is completed. These
              details are private — only you and our admins can see them.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-3xl text-primary animate-spin">refresh</span>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="space-y-8 bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8"
            >
              {/* Bank section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-primary">account_balance</span>
                  <h2 className="text-lg font-bold text-white">Bank account</h2>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-400">
                    Account holder
                  </span>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Full name as it appears on the account"
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-400">Bank</span>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Banco Pichincha"
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-400">
                    Account number
                  </span>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="••••••••"
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-400">
                    ID / Cédula <span className="text-slate-600">(optional)</span>
                  </span>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className={inputBase}
                  />
                </label>
              </section>

              <div className="h-px bg-white/5" />

              {/* Wallet section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-primary">account_balance_wallet</span>
                  <h2 className="text-lg font-bold text-white">Digital wallet</h2>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-400">Provider</span>
                  <select
                    value={walletProvider}
                    onChange={(e) => setWalletProvider(e.target.value as WalletProvider)}
                    className={inputBase}
                  >
                    {WALLET_PROVIDERS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-400">
                    Handle / address / email
                  </span>
                  <input
                    type="text"
                    value={walletHandle}
                    onChange={(e) => setWalletHandle(e.target.value)}
                    placeholder="you@example.com / 0x... / @user"
                    className={inputBase}
                  />
                </label>
              </section>

              {msg && (
                <p
                  className={`text-xs ${
                    msg.type === "success" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition btn-glow disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save payout details"}
                </button>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                <span className="material-icons text-xs align-middle mr-1">lock</span>
                Payout processing isn&apos;t live yet — saving these details now means
                they&apos;ll be ready once the platform turns payouts on.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PayoutsPage() {
  return (
    <ProtectedRoute>
      <PayoutsContent />
    </ProtectedRoute>
  );
}
