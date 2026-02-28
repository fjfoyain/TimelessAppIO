"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

type NotificationType = "contract" | "message" | "payment" | "security" | "draft";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isNew: boolean;
  actions?: { label: string; primary?: boolean }[];
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "contract",
    title: "Contract Signed: Project Alpha",
    description: "Acme Corp has countersigned. The document is ready for your countersignature to finalize the deal.",
    time: "Today, 2:30 PM",
    isNew: true,
    actions: [{ label: "View Contract", primary: true }, { label: "Download PDF" }],
  },
  {
    id: "2",
    type: "message",
    title: "New Message from Sarah",
    description: "Hey, just wanted to check on the timeline for the new designs. Are we still on track for Friday's delivery?",
    time: "Today, 1:15 PM",
    isNew: true,
    actions: [{ label: "Reply Now", primary: true }],
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Received",
    description: "You received $4,500.00 from Global Tech Solutions. Invoice #INV-2024-317 is now marked as paid.",
    time: "Today, 11:00 AM",
    isNew: false,
  },
  {
    id: "4",
    type: "security",
    title: "Security Alert: New Login",
    description: "New login detected from a new device: MacBook Pro in London, UK. If this wasn't you, please secure your account.",
    time: "Yesterday, 4:20 PM",
    isNew: false,
  },
  {
    id: "5",
    type: "draft",
    title: "Draft Created: Website Redesign",
    description: "You created a new contract draft for client 'Sophiendy Co'. Review and send for approval.",
    time: "Yesterday, 2:00 PM",
    isNew: false,
  },
];

const typeIcons: Record<NotificationType, { icon: string; color: string; bg: string }> = {
  contract: { icon: "description", color: "text-primary-light", bg: "bg-primary/10" },
  message: { icon: "chat", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  payment: { icon: "payments", color: "text-green-400", bg: "bg-green-400/10" },
  security: { icon: "shield", color: "text-amber-400", bg: "bg-amber-400/10" },
  draft: { icon: "edit_note", color: "text-slate-400", bg: "bg-slate-400/10" },
};

const tabs = ["All Notifications", "Contracts", "Messages", "Payments"];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All Notifications");

  const filteredNotifications = mockNotifications.filter((n) => {
    if (activeTab === "All Notifications") return true;
    if (activeTab === "Contracts") return n.type === "contract" || n.type === "draft";
    if (activeTab === "Messages") return n.type === "message";
    if (activeTab === "Payments") return n.type === "payment";
    return true;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-dark">
        <AnimatedBackground />
        <Navbar />

        <main className="relative z-10 pt-24 pb-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex">
              {/* Left Sidebar - Tabs */}
              <div className="w-56 pr-6 hidden md:block">
                <nav className="space-y-1 sticky top-24">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        activeTab === tab
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Inbox</h1>
                    <p className="text-slate-500 text-sm mt-1">
                      Stay updated with your latest contract activities and messages.
                    </p>
                  </div>
                  <button className="text-primary text-sm font-medium hover:text-primary-light transition">
                    Mark all as read
                  </button>
                </div>

                {/* Mobile Tabs */}
                <div className="flex gap-2 mb-6 md:hidden overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                        activeTab === tab
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-slate-400 bg-white/5"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Notification Groups */}
                <div className="space-y-3">
                  {filteredNotifications.map((n) => {
                    const style = typeIcons[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`bg-surface-dark/50 backdrop-blur-xl border rounded-xl p-5 transition hover:bg-white/[0.02] ${
                          n.isNew ? "border-primary/20" : "border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                            <span className={`material-icons ${style.color} text-xl`}>{style.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                              {n.isNew && (
                                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                              {n.description}
                            </p>
                            <p className="text-xs text-slate-600 mt-2">{n.time}</p>

                            {n.actions && (
                              <div className="flex gap-2 mt-3">
                                {n.actions.map((action) => (
                                  <button
                                    key={action.label}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                      action.primary
                                        ? "bg-primary hover:bg-primary-dark text-white"
                                        : "border border-white/10 text-slate-300 hover:bg-white/5"
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-16">
                    <span className="material-icons text-4xl text-slate-700 mb-3">notifications_off</span>
                    <p className="text-white font-semibold">No notifications</p>
                    <p className="text-slate-500 text-sm mt-1">You&apos;re all caught up!</p>
                  </div>
                )}

                {/* Pro Tip */}
                <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-4">
                  <span className="material-icons text-primary text-xl">tips_and_updates</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pro Tip</h4>
                    <p className="text-slate-400 text-sm mt-1">
                      You can automate notification settings in the preferences panel to prioritize contract alerts.
                    </p>
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
