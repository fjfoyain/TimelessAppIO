"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const mockTransactions = [
  { id: "1", title: "Summer Jazz Festival", date: "Oct 15, 2025", type: "Ticket Sales", amount: "+$450.00", status: "Completed" },
  { id: "2", title: "Chase Bank — 8890", date: "Oct 12, 2025", type: "Payout", amount: "-$1,200.00", status: "Completed" },
  { id: "3", title: "The Blue Note", date: "Oct 10, 2025", type: "Performance", amount: "+$850.00", status: "Processing" },
  { id: "4", title: "Studio Session — Neon Nights", date: "Oct 8, 2025", type: "Studio Booking", amount: "+$320.00", status: "Completed" },
  { id: "5", title: "Equipment Rental", date: "Oct 5, 2025", type: "Rental", amount: "-$75.00", status: "Completed" },
];

const statusColors: Record<string, string> = {
  Completed: "text-green-400 bg-green-400/10",
  Processing: "text-yellow-400 bg-yellow-400/10",
  Pending: "text-slate-400 bg-slate-400/10",
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "methods">("overview");

  return (
    <ProtectedRoute>
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
                    <p className="text-4xl md:text-5xl font-black text-white">$12,450.00</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                        <span className="material-icons text-sm">trending_up</span>
                        +15.3%
                      </span>
                      <span className="text-slate-500 text-xs">Compared to last month</span>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow">
                        <span className="material-icons text-sm">add</span>
                        Add Funds
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition">
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
                      <span className="material-icons text-primary text-sm">confirmation_number</span>
                      <span className="text-xs font-medium uppercase tracking-wider">Ticket Sales</span>
                    </div>
                    <p className="text-2xl font-bold text-white">$8,230.50</p>
                    <span className="text-green-400 text-xs font-medium">+23%</span>
                  </div>
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <span className="material-icons text-primary text-sm">music_note</span>
                      <span className="text-xs font-medium uppercase tracking-wider">Gig Payments</span>
                    </div>
                    <p className="text-2xl font-bold text-white">$3,840.00</p>
                    <span className="text-green-400 text-xs font-medium">+8%</span>
                  </div>
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <span className="material-icons text-yellow-400 text-sm">schedule</span>
                      <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-white">$379.50</p>
                    <span className="text-slate-500 text-xs">Available in 3 days</span>
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
                  <div className="divide-y divide-white/5">
                    {mockTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-icons text-primary text-sm">
                              {tx.type === "Payout" ? "account_balance" : tx.type === "Rental" ? "build" : "payments"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{tx.title}</p>
                            <p className="text-xs text-slate-500">{tx.date} &middot; {tx.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${tx.amount.startsWith("+") ? "text-green-400" : "text-white"}`}>
                            {tx.amount}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[tx.status]}`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Payment Methods</h3>
                    <button className="text-primary text-sm font-medium hover:text-primary-light transition flex items-center gap-1">
                      <span className="material-icons text-sm">add</span>
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl border transition cursor-pointer ${
                        activeTab === "overview"
                          ? "border-primary/30 bg-primary/5"
                          : "border-white/5 hover:bg-white/[0.02]"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <span className="material-icons text-blue-400 text-sm">credit_card</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Visa ending in •4262</p>
                        <p className="text-xs text-slate-500">Expires 08/27</p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl border transition cursor-pointer ${
                        activeTab === "methods"
                          ? "border-primary/30 bg-primary/5"
                          : "border-white/5 hover:bg-white/[0.02]"
                      }`}
                      onClick={() => setActiveTab("methods")}
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <span className="material-icons text-green-400 text-sm">account_balance</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Chase Bank</p>
                        <p className="text-xs text-slate-500">••••8890</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left">
                      <span className="material-icons text-primary">send</span>
                      <span className="text-sm text-white font-medium">Send Payment</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left">
                      <span className="material-icons text-primary">request_quote</span>
                      <span className="text-sm text-white font-medium">Request Payment</span>
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
      </div>
    </ProtectedRoute>
  );
}
