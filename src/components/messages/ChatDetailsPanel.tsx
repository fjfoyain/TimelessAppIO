"use client";

import { useState } from "react";
import Link from "next/link";
import { useContrataciones } from "@/hooks/useFirestore";
import { ESTADO_LABELS, acciones, dollars, type Estado } from "@/lib/contratacion";

const CLOSED: Estado[] = ["cancelada", "expirada"];

// The bookings between the two people in this chat. Rendered in the right
// sidebar on desktop and under the "Bookings" tab on mobile. Offers, deposit
// and history live on the booking itself, where every step is recorded.
export default function ChatDetailsPanel({
  userId,
  otherUserId,
  otherName,
}: {
  userId?: string;
  otherUserId?: string;
  otherName: string;
}) {
  const { items, loading, waitingDeposit } = useContrataciones(userId);
  const between = items.filter((c) => otherUserId && c.parties.includes(otherUserId));
  // Read once per mount: render must not depend on the clock.
  const [now] = useState(() => Date.now());

  return (
    <>
      <h3 className="text-lg font-bold text-white mb-4">Bookings</h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : between.length === 0 ? (
        <div className="flex flex-col items-center text-center py-8 gap-3">
          <span className="material-icons text-3xl text-slate-700" aria-hidden="true">event_available</span>
          <p className="text-sm text-slate-400">No bookings with {otherName} yet</p>
          <p className="text-xs text-slate-500">
            A booking starts from a plan on a DJ&apos;s profile. Its price, deposit and history will show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {between.map((c) => {
            const myMove = userId ? acciones(c, userId, now, { anticipoPendiente: waitingDeposit.has(c.id) }).some((a) => a !== "cancelar") : false;
            return (
              <li key={c.id}>
                <Link
                  href={`/contrataciones/${c.id}`}
                  className={`block rounded-xl border p-4 transition hover:border-primary/40 ${
                    CLOSED.includes(c.status) ? "border-white/5 opacity-60" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">{c.plan.title}</p>
                    <p className="text-sm font-semibold text-white tabular-nums shrink-0">
                      {dollars(c.agreedCents ?? c.oferta.amountCents)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(c.event.at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-slate-500">{ESTADO_LABELS[c.status]}</span>
                    {myMove && (
                      <span className="text-[11px] font-semibold text-primary-light bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5">
                        Your move
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
