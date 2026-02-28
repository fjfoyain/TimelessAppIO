"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const tickets = [
  {
    id: "TKT-8493-2019",
    eventName: "Neon Pulse Festival",
    date: "March 15, 2026",
    venue: "The Underground, Miami",
    type: "VIP" as const,
    status: "ACTIVE" as const,
  },
  {
    id: "TKT-6271-4035",
    eventName: "Bass Culture Night",
    date: "March 22, 2026",
    venue: "Echo Lounge, Los Angeles",
    type: "General" as const,
    status: "ACTIVE" as const,
  },
  {
    id: "TKT-1085-7723",
    eventName: "Frequency Summit 2026",
    date: "April 5, 2026",
    venue: "Warehouse District, New York",
    type: "VIP" as const,
    status: "ACTIVE" as const,
  },
];

function TicketsContent() {
  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-primary-light text-3xl">confirmation_number</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">My Tickets</h1>
            </div>
            <p className="text-slate-500">
              Your digital tickets for upcoming events. Show the QR code at the door.
            </p>
          </div>

          {/* Tickets Grid */}
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Ticket Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          ticket.type === "VIP"
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                            : "bg-primary/10 border border-primary/30 text-primary-light"
                        }`}
                      >
                        {ticket.type}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        TICKET {ticket.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{ticket.eventName}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="material-icons text-lg text-slate-500">calendar_today</span>
                        {ticket.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="material-icons text-lg text-slate-500">location_on</span>
                        {ticket.venue}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="material-icons text-lg text-slate-600">tag</span>
                        {ticket.id}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary-light hover:bg-primary/20 transition">
                        <span className="material-icons text-sm">share</span>
                        Share
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition">
                        <span className="material-icons text-sm">picture_as_pdf</span>
                        PDF
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition">
                        <span className="material-icons text-sm">account_balance_wallet</span>
                        Wallet
                      </button>
                    </div>
                  </div>

                  {/* Right: QR Code Area */}
                  <div className="flex items-center justify-center p-6 md:border-l border-t md:border-t-0 border-dashed border-white/10">
                    <div className="w-36 h-36 rounded-xl border-2 border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2">
                      <span className="material-icons text-4xl text-slate-600">qr_code_2</span>
                      <span className="text-[10px] text-slate-600 font-mono">{ticket.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TicketsPage() {
  return (
    <ProtectedRoute>
      <TicketsContent />
    </ProtectedRoute>
  );
}
