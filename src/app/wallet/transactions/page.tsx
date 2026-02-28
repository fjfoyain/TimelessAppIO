"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const allTransactions = [
  { id: "1", title: "Summer Jazz Festival", date: "Oct 15, 2025", type: "Ticket Sales", amount: "+$450.00", status: "Completed" },
  { id: "2", title: "Chase Bank — 8890", date: "Oct 12, 2025", type: "Payout", amount: "-$1,200.00", status: "Completed" },
  { id: "3", title: "The Blue Note", date: "Oct 10, 2025", type: "Performance", amount: "+$850.00", status: "Processing" },
  { id: "4", title: "Studio Session — Neon Nights", date: "Oct 8, 2025", type: "Studio Booking", amount: "+$320.00", status: "Completed" },
  { id: "5", title: "Equipment Rental", date: "Oct 5, 2025", type: "Rental", amount: "-$75.00", status: "Completed" },
  { id: "6", title: "Rooftop Vibes — DJ Set", date: "Oct 3, 2025", type: "Performance", amount: "+$600.00", status: "Completed" },
  { id: "7", title: "Visa Refund — Cancelled Event", date: "Sep 28, 2025", type: "Refund", amount: "+$150.00", status: "Completed" },
  { id: "8", title: "Sound Engineering — Album Mix", date: "Sep 25, 2025", type: "Studio Booking", amount: "+$1,500.00", status: "Completed" },
  { id: "9", title: "Bank Transfer — Wells Fargo", date: "Sep 20, 2025", type: "Payout", amount: "-$2,000.00", status: "Completed" },
  { id: "10", title: "Festival Pass — Neon Nights", date: "Sep 18, 2025", type: "Ticket Sales", amount: "+$280.00", status: "Completed" },
];

const types = ["All", "Ticket Sales", "Performance", "Studio Booking", "Payout", "Rental", "Refund"];

const statusColors: Record<string, string> = {
  Completed: "text-green-400 bg-green-400/10",
  Processing: "text-yellow-400 bg-yellow-400/10",
  Pending: "text-slate-400 bg-slate-400/10",
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allTransactions.filter((tx) => {
    const matchType = filter === "All" || tx.type === filter;
    const matchSearch = !search || tx.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <ProtectedRoute>
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
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
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
                          <span className="material-icons text-primary text-sm">
                            {tx.type === "Payout" ? "account_balance" : tx.type === "Refund" ? "replay" : "payments"}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white">{tx.title}</span>
                      </div>
                      <div className="sm:col-span-2 text-xs text-slate-500">{tx.date}</div>
                      <div className="sm:col-span-2 text-xs text-slate-400">{tx.type}</div>
                      <div className={`sm:col-span-1 text-sm font-bold text-right ${tx.amount.startsWith("+") ? "text-green-400" : "text-white"}`}>
                        {tx.amount}
                      </div>
                      <div className="sm:col-span-2 text-right">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[tx.status]}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <span className="material-icons text-4xl text-slate-700 mb-3">search_off</span>
                    <p className="text-white font-semibold">No transactions found</p>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center mt-6">
              Showing {filtered.length} of {allTransactions.length} transactions
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
