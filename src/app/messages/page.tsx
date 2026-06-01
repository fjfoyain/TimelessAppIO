"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useMessages, useBookings } from "@/hooks/useFirestore";
import { maskContactInfo } from "@/lib/chat";
import {
  proposeOffer,
  acceptOffer,
  getContractById,
  addTalentReview,
} from "@/lib/firestore";
import type { Contract } from "@/types";

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
  const searchParams = useSearchParams();
  const toUserId = searchParams.get("to");
  const convoParam = searchParams.get("convo");
  const { conversations, loading: convosLoading } = useConversations(user?.id);
  const { bookings, loading: bookingsLoading } = useBookings(user?.id);
  const [activeConvoId, setActiveConvoId] = useState<string | undefined>(undefined);
  const { messages, loading: msgsLoading, sendMessage } = useMessages(activeConvoId);
  const [newMessage, setNewMessage] = useState("");
  const [contactMasked, setContactMasked] = useState(false);
  const [offerInput, setOfferInput] = useState("");
  const [offerBusy, setOfferBusy] = useState(false);
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [tab, setTab] = useState<"messages" | "contracts">("messages");
  const [showChat, setShowChat] = useState(false);
  const latestBooking = bookings.length > 0 ? bookings[0] : null;

  useEffect(() => {
    if (convosLoading || activeConvoId) return;
    // Opened from a talent profile ("Discuss this Plan" / "Contact").
    if (convoParam) {
      const byId = conversations.find((c) => c.id === convoParam);
      if (byId) {
        setActiveConvoId(byId.id);
        setShowChat(true);
        return;
      }
    }
    if (toUserId) {
      const match = conversations.find((c) =>
        c.participants?.includes(toUserId) ||
        (c.participantNames && toUserId in c.participantNames)
      );
      if (match) {
        setActiveConvoId(match.id);
        setShowChat(true);
        return;
      }
    }
    if (conversations.length > 0) {
      setActiveConvoId(conversations[0].id);
    }
  }, [conversations, convosLoading, activeConvoId, toUserId, convoParam]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  // Load the contract attached to the active conversation (if any).
  useEffect(() => {
    setReviewSubmitted(false);
    if (!activeConvo?.contractId) {
      setActiveContract(null);
      return;
    }
    let cancelled = false;
    getContractById(activeConvo.contractId).then((c) => {
      if (!cancelled) setActiveContract(c);
    });
    return () => {
      cancelled = true;
    };
  }, [activeConvo?.contractId]);

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
    // Hide phone numbers / emails so deals stay on the platform.
    const { text, masked } = maskContactInfo(newMessage.trim());
    setContactMasked(masked);
    await sendMessage(user.id, text);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectConvo = (id: string) => {
    setActiveConvoId(id);
    setShowChat(true);
  };

  async function handlePropose() {
    if (!user || !activeConvo) return;
    const amount = parseFloat(offerInput);
    if (!amount || amount <= 0) return;
    setOfferBusy(true);
    try {
      await proposeOffer(activeConvo.id, user.id, user.name, amount);
      setOfferInput("");
    } finally {
      setOfferBusy(false);
    }
  }

  async function handleAcceptOffer() {
    if (!user || !activeConvo?.negotiation) return;
    setOfferBusy(true);
    try {
      await acceptOffer(activeConvo.id, user.id, user.name, activeConvo.negotiation);
    } finally {
      setOfferBusy(false);
    }
  }

  async function handleSubmitReview() {
    if (!user || !activeContract) return;
    if (rating < 1 || rating > 5) return;
    if (!reviewComment.trim()) return;
    setReviewBusy(true);
    try {
      await addTalentReview({
        talentId: activeContract.talentId,
        clientId: user.id,
        clientName: user.name,
        rating,
        comment: reviewComment.trim(),
      });
      setReviewSubmitted(true);
      setReviewComment("");
      setRating(5);
    } finally {
      setReviewBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 flex-1 pt-16">
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden">

          {/* Left: Conversation List — hidden on mobile when chat is open */}
          <div
            className={`${
              showChat ? "hidden md:flex" : "flex"
            } w-full md:w-72 lg:w-80 border-r border-white/5 bg-surface-dark/30 backdrop-blur-xl flex-col shrink-0`}
          >
            <div className="px-4 py-3 border-b border-white/5">
              <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
              <div className="flex gap-2">
                {(["All", "Unread", "Archived"] as const).map((f) => (
                  <button
                    key={f}
                    className="px-3 py-2.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition min-h-[44px]"
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
                    onClick={() => handleSelectConvo(c.id)}
                    className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition min-h-[64px] ${
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

          {/* Center: Chat Thread — hidden on mobile when no chat selected */}
          <div
            className={`${
              showChat ? "flex" : "hidden md:flex"
            } flex-1 flex-col min-w-0`}
          >
            {/* Chat Header */}
            <div className="px-4 sm:px-6 py-3 border-b border-white/5 bg-surface-dark/30 backdrop-blur-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {/* Back button — mobile only */}
                <button
                  onClick={() => setShowChat(false)}
                  className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
                  aria-label="Back to conversations"
                >
                  <span className="material-icons">arrow_back</span>
                </button>
                {activeConvo ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xs shrink-0">
                      {getInitial(activeConvo)}
                    </div>
                    <span className="text-white font-semibold text-sm truncate">{getOtherParticipantName(activeConvo)}</span>
                  </>
                ) : (
                  <span className="text-slate-500 text-sm">Select a conversation</span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {(["messages", "contracts"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition min-h-[36px] ${
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
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4">
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
                        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
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
            <div className="px-3 py-3 sm:px-6 sm:py-4 border-t border-white/5 bg-surface-dark/30 backdrop-blur-xl">
              {contactMasked && (
                <p className="mb-2 text-xs text-amber-400 flex items-center gap-1.5">
                  <span className="material-icons text-sm">shield</span>
                  Phone numbers and emails are hidden — keep deals on Timeless for
                  your protection.
                </p>
              )}
              <div className="flex items-center gap-2 sm:gap-3">
                <button className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-white transition shrink-0" aria-label="Attach file">
                  <span className="material-icons">attach_file</span>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (contactMasked) setContactMasked(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface-input border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                <button
                  onClick={handleSend}
                  className="w-11 h-11 rounded-xl bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition shrink-0"
                  aria-label="Send message"
                >
                  <span className="material-icons text-xl">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Contract / Booking Details */}
          <div className="w-72 lg:w-80 border-l border-white/5 bg-surface-dark/30 backdrop-blur-xl p-6 overflow-y-auto hidden lg:block">
            <h3 className="text-lg font-bold text-white mb-4">Contract Details</h3>

            {activeConvo?.planContext && user && (
              <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-light mb-2">
                  Plan under discussion
                </p>
                <p className="text-sm font-semibold text-white">
                  {activeConvo.planContext.planTitle}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Listed at ${activeConvo.planContext.planPrice}
                </p>

                <div className="mt-3 pt-3 border-t border-white/10">
                  {activeConvo.negotiation?.status === "agreed" ? (
                    <>
                      <p className="text-xs text-green-400 flex items-center gap-1.5">
                        <span className="material-icons text-sm">handshake</span>
                        Agreed at
                        <span className="font-bold ml-1">${activeConvo.negotiation.currentOffer}</span>
                      </p>
                      <Link
                        href={`/booking/contract?convo=${activeConvo.id}&amount=${activeConvo.negotiation.currentOffer}`}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
                      >
                        <span className="material-icons text-sm">draw</span>
                        Proceed to contract
                      </Link>
                    </>
                  ) : (
                    <>
                      {activeConvo.negotiation && (
                        <p className="text-xs text-slate-300 mb-2">
                          Current offer:{" "}
                          <span className="font-bold text-white">
                            ${activeConvo.negotiation.currentOffer}
                          </span>{" "}
                          <span className="text-slate-500">
                            (
                            {activeConvo.negotiation.proposedBy === user.id
                              ? "you"
                              : activeConvo.participantNames?.[
                                  activeConvo.negotiation.proposedBy
                                ] ?? "the other party"}
                            )
                          </span>
                        </p>
                      )}
                      {activeConvo.negotiation &&
                        activeConvo.negotiation.proposedBy !== user.id &&
                        !activeConvo.negotiation.acceptedBy.includes(user.id) && (
                          <button
                            onClick={handleAcceptOffer}
                            disabled={offerBusy}
                            className="w-full py-2 rounded-lg bg-green-500/15 border border-green-500/40 text-green-300 text-xs font-semibold hover:bg-green-500/25 transition disabled:opacity-50 mb-2"
                          >
                            Accept ${activeConvo.negotiation.currentOffer}
                          </button>
                        )}
                      {activeConvo.negotiation &&
                        activeConvo.negotiation.proposedBy === user.id && (
                          <p className="text-[11px] text-slate-500 mb-2">
                            Waiting for the other side to accept...
                          </p>
                        )}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          value={offerInput}
                          onChange={(e) => setOfferInput(e.target.value)}
                          placeholder={
                            activeConvo.negotiation
                              ? "Counter"
                              : `Propose (e.g. ${activeConvo.planContext.planPrice})`
                          }
                          className="flex-1 rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={handlePropose}
                          disabled={!offerInput || offerBusy}
                          className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                        >
                          {activeConvo.negotiation ? "Counter" : "Propose"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Post-contract review (visible to the client once both signed) */}
            {activeContract?.status === "fully_signed" &&
              user?.id === activeContract.clientId && (
                <div className="mb-5 p-4 rounded-xl bg-surface-input/40 border border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Rate this experience
                  </p>
                  {reviewSubmitted ? (
                    <p className="text-xs text-green-400 flex items-center gap-1.5">
                      <span className="material-icons text-sm">check_circle</span>
                      Thanks — your review is live.
                    </p>
                  ) : (
                    <>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRating(n)}
                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                            className="text-yellow-400 hover:scale-110 transition-transform"
                          >
                            <span className="material-icons text-lg">
                              {n <= rating ? "star" : "star_border"}
                            </span>
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="How did it go? (visible on their profile)"
                        rows={3}
                        className="w-full rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={!reviewComment.trim() || reviewBusy}
                        className="mt-2 w-full py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                      >
                        {reviewBusy ? "Submitting..." : "Submit review"}
                      </button>
                    </>
                  )}
                </div>
              )}

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
      <Suspense fallback={null}>
        <MessagesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
