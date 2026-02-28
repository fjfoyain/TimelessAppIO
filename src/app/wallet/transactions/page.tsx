"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useFirestore";

const typeFilters = ["All", "deposit", "withdrawal", "payment", "payout", "refund", "commission"];

const statusColors: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10",
  processing: "text-yellow-400 bg-yellow-400/10",
  pending: "text-slate-400 bg-slate-400/10",
};

function formatCurrency(amount: number): string {
  return Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

function txLabel(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace("_", " ");
}

function TransactionsContent() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions(user?.id);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((tx) => {
    const matchType = filter === "All" || tx.type === filter;
    const matchSearch = !search || tx.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <span className="material-icons text-5xl text-primary animate-pulse">receipt_long</span>
            <p className="text-slate-500 mt-4">Loading transactions...</p>
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/wallet" className="hover:text-primary transition-colors">
              Wallet
            </Link>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="text-white">Transaction History</span>
          </nav>

          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-slate-500 mb-8">View and filter all your past transactions.</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none cursor-pointer"
            >
              {typeFilters.map((t) => (
                <option key={t} value={t}>{t === "All" ? "All" : txLabel(t)}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider font-medium">
              <div className="col-span-5">Transaction</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-1 text-right">Amount</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {filtered.length > 0 ? (
                filtered.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-white/[0.02] transition items-center">
                    <div className="sm:col-span-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-icons text-primary text-sm">{txIcon(tx.type)}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{tx.description}</span>
                    </div>
                    <div className="sm:col-span-2 text-xs text-slate-500">{formatDate(tx.createdAt)}</div>
                    <div className="sm:col-span-2 text-xs text-slate-400">{txLabel(tx.type)}</div>
                    <div className={`sm:col-span-1 text-sm font-bold text-right ${tx.amount > 0 ? "text-green-400" : "text-white"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount < 0 ? "-" : ""}${formatCurrency(tx.amount)}
                    </div>
                    <div className="sm:col-span-2 text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[tx.status] || "text-slate-400 bg-slate-400/10"}`}>
                        {txLabel(tx.status)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="material-icons text-4xl text-slate-700 mb-3">search_off</span>
                  <p className="text-white font-semibold">No transactions found</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {transactions.length === 0 ? "Add funds to get started." : "Try adjusting your filters."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center mt-6">
            Showing {filtered.length} of {transactions.length} transactions
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsContent />
    </ProtectedRoute>
  );
}
