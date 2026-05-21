"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useVenueByUserId } from "@/hooks/useFirestore";
import { saveVenueProfile } from "@/lib/firestore";

const EVENT_TYPES = [
  "Techno",
  "House",
  "Live Jazz",
  "Corporate",
  "Private Parties",
  "Classical",
];

function VenueEditContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { venue, loading } = useVenueByUserId(user?.id);

  const [form, setForm] = useState({
    venueName: "",
    address: "",
    capacity: "",
    eventTypes: [] as string[],
    equipment: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Prefill the form once the existing venue (if any) has loaded.
  useEffect(() => {
    if (venue) {
      setForm({
        venueName: venue.venueName || "",
        address: venue.address || "",
        capacity: venue.capacity ? String(venue.capacity) : "",
        eventTypes: venue.eventTypes || [],
        equipment: venue.equipment || "",
        website: venue.website || "",
      });
    }
  }, [venue]);

  function set(field: keyof typeof form, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toggleEventType(tag: string) {
    set(
      "eventTypes",
      form.eventTypes.includes(tag)
        ? form.eventTypes.filter((t) => t !== tag)
        : [...form.eventTypes, tag]
    );
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.venueName.trim().length < 2) e.venueName = "Venue name is required.";
    if (form.address.trim().length < 2) e.address = "Address is required.";
    const cap = parseInt(form.capacity, 10);
    if (!form.capacity || Number.isNaN(cap) || cap < 1)
      e.capacity = "Enter a valid capacity.";
    if (form.eventTypes.length === 0)
      e.eventTypes = "Select at least one event type.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!user) return;
    if (!validate()) return;

    setSaving(true);
    setSaveError(null);
    try {
      await saveVenueProfile(user.id, {
        venueName: form.venueName.trim(),
        address: form.address.trim(),
        capacity: parseInt(form.capacity, 10),
        eventTypes: form.eventTypes,
        equipment: form.equipment.trim() || undefined,
        website: form.website.trim() || undefined,
      });
      router.push("/dashboard/venue");
    } catch {
      setSaveError("Could not save your venue. Please try again.");
      setSaving(false);
    }
  }

  const isNew = !loading && !venue;
  const inputBase =
    "w-full rounded-xl bg-surface-input border px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm";
  const border = (field: string) =>
    errors[field] ? "border-red-500" : "border-white/10";

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {isNew ? "Create Your Venue" : "Edit Venue Profile"}
            </h1>
            <p className="text-slate-500 mt-1">
              {isNew
                ? "Add your venue so it appears when organizers create events."
                : "Keep your venue details up to date."}
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-3xl text-primary animate-spin">
                refresh
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 space-y-5"
            >
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Venue Name</span>
                <input
                  type="text"
                  value={form.venueName}
                  onChange={(e) => set("venueName", e.target.value)}
                  placeholder="e.g. Neon Garden Rooftop"
                  className={`${inputBase} ${border("venueName")}`}
                />
                {errors.venueName && (
                  <span className="text-xs text-red-400">{errors.venueName}</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Address</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street, city"
                  className={`${inputBase} ${border("address")}`}
                />
                {errors.address && (
                  <span className="text-xs text-red-400">{errors.address}</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Capacity</span>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                  placeholder="e.g. 300"
                  className={`${inputBase} ${border("capacity")}`}
                />
                {errors.capacity && (
                  <span className="text-xs text-red-400">{errors.capacity}</span>
                )}
              </label>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Event Types</span>
                <div className="flex flex-wrap gap-3">
                  {EVENT_TYPES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEventType(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                        form.eventTypes.includes(tag)
                          ? "bg-primary/20 border-primary/50 text-primary-light"
                          : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {errors.eventTypes && (
                  <span className="text-xs text-red-400">{errors.eventTypes}</span>
                )}
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Equipment <span className="text-slate-600">(optional)</span>
                </span>
                <textarea
                  value={form.equipment}
                  onChange={(e) => set("equipment", e.target.value)}
                  placeholder="Sound system, lighting, stage..."
                  rows={3}
                  className={`${inputBase} ${border("equipment")} resize-y`}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Website <span className="text-slate-600">(optional)</span>
                </span>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://..."
                  className={`${inputBase} ${border("website")}`}
                />
              </label>

              {saveError && <p className="text-sm text-red-400">{saveError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/venue")}
                  className="px-6 py-3 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition btn-glow flex items-center gap-2 disabled:opacity-50"
                >
                  <span className="material-icons text-sm">save</span>
                  {saving ? "Saving..." : isNew ? "Create Venue" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VenueEditPage() {
  return (
    <ProtectedRoute>
      <VenueEditContent />
    </ProtectedRoute>
  );
}
