"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getVenues, createEvent } from "@/lib/firestore";
import type { Venue } from "@/types";

const steps = ["Event Basics", "Venue & Date", "Talent & Services", "Review"];

const serviceTypes = ["DJ Spark", "Security", "Photography", "Videography", "Sound Engineer", "Lighting"];

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    selectedServices: [] as string[],
    talentSearch: "",
  });

  // Load venues from Firestore on mount
  useEffect(() => {
    getVenues()
      .then((data) => setVenues(data))
      .catch(() => setVenues([]))
      .finally(() => setVenuesLoading(false));
  }, []);

  async function handlePublish() {
    if (!user) return;
    setPublishing(true);
    setPublishError(null);
    try {
      await createEvent({
        title: formData.name,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        venueId: formData.venue,
        organizerId: user.id,
        organizer: user.name,
        services: formData.selectedServices,
      });
      router.push("/dashboard/events");
    } catch {
      setPublishError("Failed to publish event. Please try again.");
      setPublishing(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleService(service: string) {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-dark">
        <AnimatedBackground />
        <Navbar />

        <main className="relative z-10 pt-24 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Create New Event</h1>
                <p className="text-slate-500 mt-1">Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-primary font-medium">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-10">
              {steps.map((step, i) => (
                <div key={step} className="flex-1">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      i <= currentStep ? "bg-primary" : "bg-white/10"
                    }`}
                  />
                  <p className={`text-xs mt-2 ${i <= currentStep ? "text-primary" : "text-slate-600"}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Form */}
              <div className="lg:col-span-3 space-y-8">
                {/* Step 1: Event Basics */}
                {currentStep === 0 && (
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="material-icons text-primary">info</span>
                      General Information
                    </h2>

                    <div className="space-y-5">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-white">Event Name</span>
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Neon Nights Rooftop Launch"
                          className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-white">Description</span>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your event..."
                          rows={4}
                          className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-y text-sm"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-white">Date</span>
                          <input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-white">Time</span>
                          <input
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Venue Selection */}
                {currentStep === 1 && (
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="material-icons text-primary">place</span>
                      Venue Selection
                    </h2>
                    <div className="space-y-3">
                      {venuesLoading ? (
                        <p className="text-slate-500 text-sm py-4 text-center">Loading venues...</p>
                      ) : venues.length === 0 ? (
                        <p className="text-slate-500 text-sm py-4 text-center">No venues available yet.</p>
                      ) : (
                        venues.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setFormData((prev) => ({ ...prev, venue: v.id }))}
                            className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-4 ${
                              formData.venue === v.id
                                ? "border-primary/30 bg-primary/5"
                                : "border-white/5 hover:bg-white/[0.02]"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="material-icons text-primary">location_city</span>
                            </div>
                            <div>
                              <p className="text-white font-semibold">{v.venueName}</p>
                              <p className="text-slate-500 text-xs">{v.eventTypes?.join(", ") || "Venue"} &middot; Capacity: {v.capacity}</p>
                            </div>
                            {formData.venue === v.id && (
                              <span className="material-icons text-primary ml-auto">check_circle</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Talent & Services */}
                {currentStep === 2 && (
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="material-icons text-primary">people</span>
                      Talent & Services
                    </h2>

                    <label className="flex flex-col gap-2 mb-6">
                      <span className="text-sm font-medium text-white">Search Talent</span>
                      <input
                        name="talentSearch"
                        type="text"
                        value={formData.talentSearch}
                        onChange={handleChange}
                        placeholder="Search DJs, Bands, Performers..."
                        className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </label>

                    <p className="text-sm font-medium text-white mb-3">Required Services</p>
                    <div className="flex flex-wrap gap-3">
                      {serviceTypes.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleService(s)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                            formData.selectedServices.includes(s)
                              ? "bg-primary/20 border-primary/50 text-primary-light"
                              : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 3 && (
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="material-icons text-primary">fact_check</span>
                      Review & Publish
                    </h2>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-slate-400">Event Name</span>
                        <span className="text-white font-medium">{formData.name || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-slate-400">Date & Time</span>
                        <span className="text-white font-medium">{formData.date || "Not set"} {formData.time}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-slate-400">Venue</span>
                        <span className="text-white font-medium">
                          {venues.find((v) => v.id === formData.venue)?.venueName || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Services</span>
                        <span className="text-white font-medium">
                          {formData.selectedServices.length > 0 ? formData.selectedServices.join(", ") : "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {publishError && (
                  <p className="text-red-400 text-sm">{publishError}</p>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-6 py-3 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep < steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                      } else {
                        handlePublish();
                      }
                    }}
                    disabled={publishing}
                    className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition btn-glow flex items-center gap-2 disabled:opacity-50"
                  >
                    {currentStep === steps.length - 1
                      ? publishing
                        ? "Publishing..."
                        : "Publish Event"
                      : "Continue"}
                    <span className="material-icons text-sm">
                      {currentStep === steps.length - 1 ? "publish" : "arrow_forward"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* Event Preview */}
                  <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-primary/30 via-purple-900/20 to-background-dark flex items-center justify-center">
                      <span className="material-icons text-6xl text-white/20">celebration</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white">{formData.name || "Your Event Name"}</h3>
                      <p className="text-slate-500 text-sm mt-1">{formData.date || "Date"} &middot; {formData.time || "Time"}</p>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <span className="material-icons text-sm">tips_and_updates</span>
                      Pro Tip
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Events with clear service requirements get 40% more applications from top-tier talent.
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
