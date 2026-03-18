"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

// Mock service plan data — in production this comes from Firestore via talent + plan IDs
const mockPlanData: Record<string, { title: string; price: number; duration: string; scope: string }> = {
  default: {
    title: "Standard Package",
    price: 500,
    duration: "Oct 1 – Oct 15, 2024",
    scope: "Full Service Engagement",
  },
};

const ESCROW_RATE = 0.05; // 5% escrow fee

function ContractContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const talentId = params.get("talent") ?? "unknown";
  const planId = params.get("plan") ?? "default";

  const plan = mockPlanData[planId] ?? mockPlanData.default;
  const escrowFee = Math.round(plan.price * ESCROW_RATE * 100) / 100;
  const total = plan.price + escrowFee;

  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [done, setDone] = useState(false);

  const handleSignAndPay = async () => {
    if (!agreed) return;
    setSigning(true);
    // Simulate async signing + payment
    await new Promise((r) => setTimeout(r, 1500));
    setSigning(false);
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <span className="material-icons text-green-400 text-6xl">check_circle</span>
        <h2 className="text-2xl font-bold text-white">Contract Signed & Payment Authorized</h2>
        <p className="text-gray-400 text-sm">
          Funds are held in escrow until service completion. Redirecting to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 pt-32 pb-24">
      {/* Back */}
      <Link
        href={`/marketplace/${talentId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-8"
      >
        <span className="material-icons text-base">arrow_back</span>
        Back to Profile
      </Link>

      <div className="rounded-2xl border border-white/5 bg-surface-dark p-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-light mb-1">
            Contract Finalization
          </p>
          <h1 className="text-2xl font-bold text-white">Contract &amp; Payment</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review the details below before signing and authorizing payment.
          </p>
        </div>

        {/* Provider info */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary-light">
            {user?.name?.charAt(0).toUpperCase() ?? "T"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.name ?? "Service Provider"}</p>
            <p className="text-xs text-gray-500">{plan.title}</p>
          </div>
        </div>

        {/* Financial summary */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Financial Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Service Dates</span>
              <span className="text-white">{plan.duration}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Project Scope</span>
              <span className="text-white">{plan.scope}</span>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">${plan.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Escrow Fee (5%)</span>
              <span className="text-white">${escrowFee.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="flex justify-between text-base font-bold">
              <span className="text-white">Total to Pay</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Payment Method
          </h2>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary text-lg">account_balance_wallet</span>
              <div>
                <p className="text-sm font-medium text-white">Primary Wallet</p>
                <p className="text-xs text-gray-500">Available balance</p>
              </div>
            </div>
            <Link href="/wallet" className="text-xs text-primary hover:text-primary-light transition-colors">
              Change
            </Link>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAgreed((v) => !v)}
            className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
              agreed ? "bg-primary border-primary" : "bg-white/5 border-white/20 group-hover:border-primary/50"
            }`}
          >
            {agreed && <span className="material-icons text-white text-sm">check</span>}
          </div>
          <span className="text-sm text-gray-400 leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-primary underline hover:text-primary-light">
              Terms of Service
            </Link>{" "}
            and authorize this payment to be held in escrow until service completion.
          </span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href={`/marketplace/${talentId}`}
            className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-gray-400 hover:text-white hover:border-white/20 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSignAndPay}
            disabled={!agreed || signing}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold btn-glow hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {signing ? (
              <>
                <span className="material-icons text-base animate-spin">refresh</span>
                Processing…
              </>
            ) : (
              <>
                <span className="material-icons text-base">draw</span>
                Sign &amp; Pay
              </>
            )}
          </button>
        </div>

        {/* Escrow note */}
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          <span className="material-icons text-base align-middle mr-1">lock</span>
          Funds are held in escrow and only released upon your confirmation of delivery.
        </p>
      </div>
    </div>
  );
}

export default function ContractPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-dark text-white">
        <AnimatedBackground />
        <Navbar />
        <Suspense fallback={<div className="pt-40 text-center text-gray-500">Loading…</div>}>
          <ContractContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
