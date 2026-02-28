"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const conversations = [
  { id: "1", name: "Alice (Booking Agent)", avatar: "A", lastMessage: "I've attached the initial rider for review.", time: "2m ago", unread: 2 },
  { id: "2", name: "Club Promoter — Bob", avatar: "B", lastMessage: "Sound check is at 4pm, confirmed.", time: "1h ago", unread: 0 },
  { id: "3", name: "Tech Manager — Charlie", avatar: "C", lastMessage: "Equipment list approved for Saturday.", time: "3h ago", unread: 0 },
  { id: "4", name: "Sarah — Legal", avatar: "S", lastMessage: "Contract revision sent, please review.", time: "1d ago", unread: 1 },
];

const messages = [
  { id: "1", from: "Alice", text: "Just checking in on the contract status for the Summer Festival gig.", time: "10:30 AM", mine: false },
  { id: "2", from: "You", text: "Hey Alice, great to hear from you. I'm reviewing the previous draft now. I had a question about the lighting requirements.", time: "10:32 AM", mine: true },
  { id: "3", from: "Alice", text: "I've attached the initial rider for review. The tech specs should cover the lighting setup. Let me know if the tech specs work for you.", time: "10:35 AM", mine: false },
];

const contractDetails = {
  title: "Summer Festival 2026",
  ref: "MCN-4592",
  date: "August 24, 2026",
  value: "$12,500.00",
  venue: "The Palladium, Los Angeles",
  requirements: ["90 min DJ Set", "Social Media Promotion (3 posts)", "Meet & Greet (30 mins)"],
};

export default function MessagesPage() {
  const [activeConvo, setActiveConvo] = useState("1");
  const [newMessage, setNewMessage] = useState("");
  const [tab, setTab] = useState<"messages" | "contracts">("messages");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-dark flex flex-col">
        <AnimatedBackground />
        <Navbar />

        <main className="relative z-10 flex-1 pt-16">
          <div className="h-[calc(100vh-4rem)] flex">
            {/* Left: Conversation List */}
            <div className="w-80 border-r border-white/5 bg-surface-dark/30 backdrop-blur-xl flex flex-col shrink-0 hidden md:flex">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
                <div className="flex gap-2">
                  {(["All", "Unread", "Archived"] as const).map((f) => (
                    <button
                      key={f}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvo(c.id)}
                    className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition ${
                      activeConvo === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-sm shrink-0">
                        {c.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                          <span className="text-xs text-slate-500 shrink-0">{c.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                      </div>
                      {c.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Chat Thread */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-surface-dark/30 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xs">
                    A
                  </div>
                  <span className="text-white font-semibold text-sm">Alice (Booking Agent)</span>
                </div>
                <div className="flex gap-2">
                  {(["messages", "contracts"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                        tab === t
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.mine
                          ? "bg-primary/20 border border-primary/30 text-white"
                          : "bg-surface-dark/80 border border-white/5 text-slate-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-[10px] text-slate-500 mt-1 text-right">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-white/5 bg-surface-dark/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button className="text-slate-500 hover:text-white transition">
                    <span className="material-icons">attach_file</span>
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-surface-input border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <button className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition">
                    <span className="material-icons text-xl">send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Contract Details */}
            <div className="w-80 border-l border-white/5 bg-surface-dark/30 backdrop-blur-xl p-6 overflow-y-auto hidden lg:block">
              <h3 className="text-lg font-bold text-white mb-4">Contract Details</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-primary">event</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{contractDetails.title}</p>
                    <p className="text-xs text-slate-500">Ref: {contractDetails.ref}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-icons text-xs">calendar_today</span>
                    {contractDetails.date}
                  </div>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="material-icons text-xs text-green-400">paid</span>
                    {contractDetails.value}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-icons text-xs">place</span>
                    {contractDetails.venue}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Requirements</p>
                  <ul className="space-y-2">
                    {contractDetails.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-icons text-primary text-xs">check_circle</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="flex-1 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition">
                    Propose Changes
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition btn-glow">
                    Sign & Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
