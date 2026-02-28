"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { createService } from "@/lib/firestore";

const categories = [
  "Sound Engineering",
  "Music Production",
  "DJ Services",
  "Vocal Coaching",
  "Mixing & Mastering",
  "Photography",
  "Videography",
  "Event Planning",
  "Stage Design",
  "Marketing",
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function NewServiceContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      await createService({
        userId: user.id,
        name: serviceName,
        category,
        description,
        hourlyRate: parseFloat(hourlyRate) || 0,
        availability: selectedDays,
      });
      setSubmitMsg({ type: "success", text: "Service published successfully!" });
      // Redirect to dashboard after brief delay so user sees success
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setSubmitMsg({ type: "error", text: "Failed to publish service. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-primary-light text-3xl">add_circle</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Add New Service</h1>
            </div>
            <p className="text-slate-500">
              List a new service to start receiving bookings from clients.
            </p>
          </div>

          {/* Form */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Live DJ Set, Studio Recording Session"
                  className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service in detail. What's included? What makes it unique?"
                  className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Hourly Rate (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              {/* Availability Days */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">
                  Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedDays.includes(day)
                          ? "bg-primary/20 border-primary/50 text-primary-light"
                          : "bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Service Image
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <span className="material-icons text-4xl text-slate-600 mb-3">cloud_upload</span>
                  <p className="text-sm text-slate-400 mb-1">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="text-xs text-slate-600">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Feedback */}
              {submitMsg && (
                <p className={`text-sm ${submitMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {submitMsg.text}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-icons text-lg">publish</span>
                {submitting ? "Publishing..." : "Publish Service"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NewServicePage() {
  return (
    <ProtectedRoute>
      <NewServiceContent />
    </ProtectedRoute>
  );
}
