"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useFirestore";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9am - 8pm

const colorOptions = [
  "bg-primary/20 border-primary/30 text-primary-light",
  "bg-cyan-500/20 border-cyan-500/30 text-cyan-300",
  "bg-pink-500/20 border-pink-500/30 text-pink-300",
  "bg-green-500/20 border-green-500/30 text-green-300",
  "bg-amber-500/20 border-amber-500/30 text-amber-300",
  "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-300",
];

export default function BookingPage() {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, createBooking } = useBookings(user?.id);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: number } | null>(null);
  const [sessionTitle, setSessionTitle] = useState("");
  const [duration, setDuration] = useState(1);
  const [confirming, setConfirming] = useState(false);
  const [bookingMsg, setBookingMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Transform flat bookings array into the Record<day, booking[]> format the calendar expects
  const bookingsByDay = useMemo(() => {
    const map: Record<string, { hour: number; title: string; color: string; duration: number }[]> = {
      Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [],
    };
    for (const b of bookings) {
      if (map[b.day]) {
        map[b.day].push({
          hour: b.hour,
          title: b.title,
          color: b.color || colorOptions[0],
          duration: b.duration,
        });
      }
    }
    return map;
  }, [bookings]);

  async function handleConfirmBooking() {
    if (!user || !selectedSlot || !sessionTitle.trim()) return;
    setConfirming(true);
    setBookingMsg(null);
    try {
      const colorIndex = bookings.length % colorOptions.length;
      await createBooking({
        userId: user.id,
        title: sessionTitle,
        day: selectedSlot.day,
        hour: selectedSlot.hour,
        duration,
        color: colorOptions[colorIndex],
      });
      setBookingMsg({ type: "success", text: "Booking confirmed!" });
      setSessionTitle("");
      setDuration(1);
      setSelectedSlot(null);
    } catch {
      setBookingMsg({ type: "error", text: "Failed to create booking. Please try again." });
    } finally {
      setConfirming(false);
    }
  }

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
                <h1 className="text-3xl md:text-4xl font-bold text-white">Booking Calendar</h1>
                <p className="text-slate-500 mt-1">Manage your sessions, rehearsals, and bookings.</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow">
                <span className="material-icons text-sm">add</span>
                New Booking
              </button>
            </div>

            {bookingsLoading ? (
              <div className="col-span-full text-center py-16">
                <p className="text-slate-500">Loading bookings...</p>
              </div>
            ) : null}

            <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${bookingsLoading ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Calendar Grid */}
              <div className="lg:col-span-3 bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-white/5">
                  {days.map((day) => (
                    <div key={day} className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-white/5 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                <div className="overflow-x-auto">
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-7 border-b border-white/5 last:border-b-0">
                      {days.map((day) => {
                        const booking = bookingsByDay[day]?.find((b) => b.hour === hour);
                        const isOccupied = bookingsByDay[day]?.some(
                          (b) => hour >= b.hour && hour < b.hour + b.duration
                        );

                        return (
                          <div
                            key={`${day}-${hour}`}
                            onClick={() => !isOccupied && setSelectedSlot({ day, hour })}
                            className={`relative min-h-[60px] px-2 py-1.5 border-r border-white/5 last:border-r-0 transition cursor-pointer ${
                              selectedSlot?.day === day && selectedSlot?.hour === hour
                                ? "bg-primary/10"
                                : isOccupied
                                ? ""
                                : "hover:bg-white/[0.02]"
                            }`}
                          >
                            {/* Hour label (first column) */}
                            {day === "Mon" && (
                              <span className="absolute -left-0 top-1 text-[10px] text-slate-600 font-mono">
                                {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "pm" : "am"}
                              </span>
                            )}

                            {booking && (
                              <div className={`text-[10px] font-medium px-2 py-1 rounded-lg border ${booking.color} truncate`}>
                                {booking.title}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Selected Slot */}
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {selectedSlot ? "Selected Slot" : "Booking Details"}
                  </h3>

                  {selectedSlot ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-icons text-primary text-sm">calendar_today</span>
                        {selectedSlot.day}, {selectedSlot.hour > 12 ? selectedSlot.hour - 12 : selectedSlot.hour}:00{" "}
                        {selectedSlot.hour >= 12 ? "PM" : "AM"}
                      </div>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-slate-400">Session Title</span>
                        <input
                          type="text"
                          value={sessionTitle}
                          onChange={(e) => setSessionTitle(e.target.value)}
                          placeholder="e.g. Studio Recording"
                          className="w-full rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-slate-400">Duration</span>
                        <select
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-full rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        >
                          <option value={1}>1 hour</option>
                          <option value={2}>2 hours</option>
                          <option value={3}>3 hours</option>
                          <option value={4}>4 hours</option>
                        </select>
                      </label>

                      {bookingMsg && (
                        <p className={`text-xs ${bookingMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
                          {bookingMsg.text}
                        </p>
                      )}

                      <button
                        onClick={handleConfirmBooking}
                        disabled={confirming || !sessionTitle.trim()}
                        className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow disabled:opacity-50"
                      >
                        {confirming ? "Confirming..." : "Confirm Booking"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      Click an empty time slot in the calendar to create a new booking.
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-3">Legend</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Studio Booking", color: "bg-primary" },
                      { label: "Mixing/Mastering", color: "bg-cyan-500" },
                      { label: "Rehearsal", color: "bg-pink-500" },
                      { label: "Performance", color: "bg-amber-500" },
                      { label: "Other", color: "bg-fuchsia-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className={`w-3 h-3 rounded ${item.color}`} />
                        {item.label}
                      </div>
                    ))}
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
