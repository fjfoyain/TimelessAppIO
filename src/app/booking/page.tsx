"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9am - 8pm

const mockBookings: Record<string, { hour: number; title: string; color: string; duration: number }[]> = {
  Mon: [{ hour: 10, title: "Studio A — Vocal Recording", color: "bg-primary/20 border-primary/30 text-primary-light", duration: 2 }],
  Tue: [],
  Wed: [{ hour: 14, title: "Mixing Session — Neon Album", color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300", duration: 3 }],
  Thu: [{ hour: 11, title: "DJ Practice — Room B", color: "bg-pink-500/20 border-pink-500/30 text-pink-300", duration: 1 }],
  Fri: [
    { hour: 9, title: "Mastering — Client A", color: "bg-green-500/20 border-green-500/30 text-green-300", duration: 2 },
    { hour: 15, title: "Live Rehearsal — The Blue Note", color: "bg-amber-500/20 border-amber-500/30 text-amber-300", duration: 3 },
  ],
  Sat: [{ hour: 13, title: "Photo Shoot — Studio C", color: "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-300", duration: 2 }],
  Sun: [],
};

export default function BookingPage() {
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: number } | null>(null);

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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                        const booking = mockBookings[day]?.find((b) => b.hour === hour);
                        const isOccupied = mockBookings[day]?.some(
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
                          placeholder="e.g. Studio Recording"
                          className="w-full rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-slate-400">Duration</span>
                        <select className="w-full rounded-lg bg-surface-input border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                          <option>1 hour</option>
                          <option>2 hours</option>
                          <option>3 hours</option>
                          <option>4 hours</option>
                        </select>
                      </label>

                      <button className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow">
                        Confirm Booking
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
