"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useMessages, useBookings } from "@/hooks/useFirestore";

function formatTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatMessageTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function MessagesContent() {
  const { user } = useAuth();
  const { conversations, loading: convosLoading } = useConversations(user?.id);
  const { bookings, loading: bookingsLoading } = useBookings(user?.id);
  const [activeConvoId, setActiveConvoId] = useState<string | undefined>(undefined);
  const { messages, loading: msgsLoading, sendMessage } = useMessages(activeConvoId);
  const [newMessage, setNewMessage] = useState("");
  const [tab, setTab] = useState<"messages" | "contracts">("messages");
  const latestBooking = bookings.length > 0 ? bookings[0] : null;

  // Set first conversation as active by default when conversations load
  useEffect(() => {
    if (conversations.length > 0 && !activeConvoId) {
      setActiveConvoId(conversations[0].id);
    }
  }, [conversations, activeConvoId]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  // Get display name for the other participant in the active conversation
  const getOtherParticipantName = (convo: typeof conversations[number]): string => {
    if (!user?.id || !convo.participantNames) return "Unknown";
    const otherNames = Object.entries(convo.participantNames)
      .filter(([id]) => id !== user.id)
      .map(([, name]) => name);
    return otherNames.length > 0 ? otherNames.join(", ") : "Unknown";
  };

  const getInitial = (convo: typeof conversations[number]): string => {
    const name = getOtherParticipantName(convo);
    return name.charAt(0).toUpperCase();
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.id) return;
    await sendMessage(user.id, newMessage.trim());
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
              {convosLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <span className="material-icons text-3xl text-slate-700 mb-2 block">chat_bubble_outline</span>
                  <p className="text-slate-500 text-sm">No conversations yet</p>
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvoId(c.id)}
                    className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition ${
                      activeConvoId === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-sm shrink-0">
                        {getInitial(c)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white truncate">{getOtherParticipantName(c)}</p>
                          <span className="text-xs text-slate-500 shrink-0">{formatTime(c.lastMessageTime)}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Center: Chat Thread */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-surface-dark/30 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeConvo ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xs">
                      {getInitial(activeConvo)}
                    </div>
                    <span className="text-white font-semibold text-sm">{getOtherParticipantName(activeConvo)}</span>
                  </>
                ) : (
                  <span className="text-slate-500 text-sm">Select a conversation</span>
                )}
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
              {msgsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !activeConvoId ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="material-icons text-4xl text-slate-700 mb-3">forum</span>
                  <p className="text-white font-semibold">No conversation selected</p>
                  <p className="text-slate-500 text-sm mt-1">Choose a conversation from the left panel to start chatting.</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="material-icons text-4xl text-slate-700 mb-3">chat_bubble_outline</span>
                  <p className="text-white font-semibold">No messages yet</p>
                  <p className="text-slate-500 text-sm mt-1">Send the first message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const mine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          mine
                            ? "bg-primary/20 border border-primary/30 text-white"
                            : "bg-surface-dark/80 border border-white/5 text-slate-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className="text-[10px] text-slate-500 mt-1 text-right">{formatMessageTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-white/5 bg-surface-dark/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button className="text-slate-500 hover:text-white transition" aria-label="Attach file">
                  <span className="material-icons">attach_file</span>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface-input border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition"
                  aria-label="Send message"
                >
                  <span className="material-icons text-xl">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Contract / Booking Details */}
          <div className="w-80 border-l border-white/5 bg-surface-dark/30 backdrop-blur-xl p-6 overflow-y-auto hidden lg:block">
            <h3 className="text-lg font-bold text-white mb-4">Contract Details</h3>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : latestBooking ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-primary">event</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{latestBooking.title}</p>
                    <p className="text-xs text-slate-500">ID: {latestBooking.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-icons text-xs">calendar_today</span>
                    {latestBooking.day}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-icons text-xs">schedule</span>
                    {latestBooking.hour}:00 ({latestBooking.duration}h)
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Link
                    href="/booking"
                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition text-center"
                  >
                    View All
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-8 gap-3">
                <span className="material-icons text-3xl text-slate-700">description</span>
                <p className="text-sm text-slate-500">No active contracts</p>
                <p className="text-xs text-slate-600">
                  Create a booking to generate contract details here.
                </p>
                <Link
                  href="/booking"
                  className="mt-2 px-5 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary-light text-sm font-medium hover:bg-primary/20 transition"
                >
                  Create Booking
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
