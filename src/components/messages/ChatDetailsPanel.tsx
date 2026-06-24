"use client";

import Link from "next/link";
import type { Conversation, Contract, Booking, User } from "@/types";

interface ChatDetailsPanelProps {
  user: User | null;
  activeConvo?: Conversation;
  offerInput: string;
  setOfferInput: (v: string) => void;
  offerBusy: boolean;
  onPropose: () => void;
  onAcceptOffer: () => void;
  activeContract: Contract | null;
  rating: number;
  setRating: (n: number) => void;
  reviewComment: string;
  setReviewComment: (v: string) => void;
  reviewBusy: boolean;
  reviewSubmitted: boolean;
  onSubmitReview: () => void;
  bookingsLoading: boolean;
  latestBooking: Booking | null;
}

// The negotiation + contract + review + booking panel shown beside a chat.
// Rendered in the right sidebar on desktop and inside the thread (via the
// "Contracts" tab) on mobile, so price negotiation is reachable on every screen.
export default function ChatDetailsPanel({
  user,
  activeConvo,
  offerInput,
  setOfferInput,
  offerBusy,
  onPropose,
  onAcceptOffer,
  activeContract,
  rating,
  setRating,
  reviewComment,
  setReviewComment,
  reviewBusy,
  reviewSubmitted,
  onSubmitReview,
  bookingsLoading,
  latestBooking,
}: ChatDetailsPanelProps) {
  return (
    <>
      <h3 className="text-lg font-bold text-white mb-4">Contract Details</h3>

      {activeConvo?.planContext && user && (
        <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-light mb-2">
            Plan under discussion
          </p>
          <p className="text-sm font-semibold text-white">
            {activeConvo.planContext.planTitle}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
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
                    <span className="text-slate-400">
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
                      onClick={onAcceptOffer}
                      disabled={offerBusy}
                      className="w-full py-2 rounded-lg bg-green-500/15 border border-green-500/40 text-green-300 text-xs font-semibold hover:bg-green-500/25 transition disabled:opacity-50 mb-2"
                    >
                      Accept ${activeConvo.negotiation.currentOffer}
                    </button>
                  )}
                {activeConvo.negotiation &&
                  activeConvo.negotiation.proposedBy === user.id && (
                    <p className="text-[11px] text-slate-400 mb-2">
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
                    onClick={onPropose}
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
                  onClick={onSubmitReview}
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
              <p className="text-xs text-slate-400">ID: {latestBooking.id.slice(0, 8)}</p>
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
          <p className="text-sm text-slate-400">No active contracts</p>
          <p className="text-xs text-slate-500">
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
    </>
  );
}
