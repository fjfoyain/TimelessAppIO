"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { signUp, getAuthErrorMessage } from "@/lib/auth";
import { createUserProfile, createVenueProfile } from "@/lib/firestore";
import { UserRole } from "@/types";
import { FirebaseError } from "firebase/app";

/* ─────────── Types ─────────── */

interface VenueFormData {
  venueName: string;
  location: string;
  capacity: string;
  eventTypes: string[];
  equipment: string;
  websiteLink: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

/* ─────────── Constants ─────────── */

const eventTags = [
  "Techno",
  "House",
  "Live Jazz",
  "Corporate",
  "Private Parties",
  "Classical",
] as const;

/* ─────────── Page ─────────── */

export default function VenueRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<VenueFormData>({
    venueName: "",
    location: "",
    capacity: "",
    eventTypes: [],
    equipment: "",
    websiteLink: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VenueFormData, boolean | string>>>({});

  function handleChange(field: keyof VenueFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  }

  function toggleEventType(tag: string) {
    setForm((prev) => {
      const exists = prev.eventTypes.includes(tag);
      return {
        ...prev,
        eventTypes: exists
          ? prev.eventTypes.filter((t) => t !== tag)
          : [...prev.eventTypes, tag],
      };
    });
    if (errors.eventTypes) {
      setErrors((prev) => ({ ...prev, eventTypes: false }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: Partial<Record<keyof VenueFormData, boolean | string>> = {};
    if (!form.venueName.trim()) newErrors.venueName = true;
    if (!form.location.trim()) newErrors.location = true;
    if (!form.capacity.trim()) newErrors.capacity = true;
    if (form.eventTypes.length === 0) newErrors.eventTypes = true;
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!form.agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const credential = await signUp(form.email, form.password, form.venueName);
      const uid = credential.user.uid;

      await createUserProfile({
        uid,
        name: form.venueName,
        email: form.email,
        role: UserRole.VENUE,
      });

      await createVenueProfile(uid, {
        venueName: form.venueName,
        location: form.location,
        capacity: parseInt(form.capacity, 10),
        eventTypes: form.eventTypes,
        equipment: form.equipment || undefined,
        websiteLink: form.websiteLink || undefined,
      });

      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setErrors({ email: getAuthErrorMessage(code) });
    } finally {
      setLoading(false);
    }
  }

  /* ── Input ring helper ── */
  const ring = (field: keyof VenueFormData) =>
    errors[field]
      ? "ring-2 ring-red-500 border-red-500"
      : "border-gray-700/50 focus:ring-2 focus:ring-primary";

  /* ─────────── Render ─────────── */

  return (
    <div className="flex flex-col lg:flex-row h-full w-full min-h-screen">
      {/* ══════════════ LEFT SIDE ══════════════ */}
      <div
        className="hidden lg:block lg:w-5/12 xl:w-1/2 relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/venue-reg-bg.jpg')" }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191022] via-primary/20 to-transparent opacity-90" />

        {/* Bottom Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 z-10">
          <div className="flex flex-col gap-5 mb-8">
            {/* Badge */}
            <div className="inline-flex items-center self-start gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="text-xs font-medium text-primary-light tracking-wide">
                Trusted by 5,000+ Venues
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Connect your stage
              <br />
              to the world.
            </h2>

            {/* Description */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              List your space on the largest network of music and event venues. Reach thousands of
              artists, promoters, and clients looking for the perfect stage.
            </p>

            {/* Avatar Stack */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#191022]">
                  <Image
                    src="/images/avatar-producer.jpg"
                    alt="Producer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#191022]">
                  <Image
                    src="/images/avatar-dj.jpg"
                    alt="DJ"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#191022]">
                  <Image
                    src="/images/avatar-engineer.jpg"
                    alt="Engineer"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-sm text-slate-400">
                <span className="text-primary-light font-semibold">New!</span> Top producers joined
                this week.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT SIDE ══════════════ */}
      <div className="w-full lg:w-7/12 xl:w-1/2 bg-[#191022] flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-light">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Timeless</span>
          </Link>
          <p className="text-sm text-slate-500">
            Already a partner?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-10">
          <div className="w-full max-w-lg">
            {/* Mobile Hero (visible on small screens only) */}
            <div className="lg:hidden mb-8">
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
                <Image
                  src="/images/venue-reg-bg.jpg"
                  alt="Venue"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191022] to-transparent" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-2">Register your Venue</h2>
            <p className="text-slate-400 mb-8">
              Complete the details below to list your space on our exclusive network.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* Venue Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Venue Name
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      storefront
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. The Velvet Room"
                      value={form.venueName}
                      onChange={(e) => handleChange("venueName", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 outline-none transition-all ${ring("venueName")}`}
                    />
                  </div>
                  {errors.venueName && (
                    <p className="mt-1 text-xs text-red-400">Venue name is required.</p>
                  )}
                </div>

                {/* Location + Capacity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Location / Address
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        place
                      </span>
                      <input
                        type="text"
                        placeholder="City or address"
                        value={form.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 outline-none transition-all ${ring("location")}`}
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-xs text-red-400">Location is required.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Capacity
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        groups
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="500"
                        value={form.capacity}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 outline-none transition-all ${ring("capacity")}`}
                      />
                    </div>
                    {errors.capacity && (
                      <p className="mt-1 text-xs text-red-400">Capacity is required.</p>
                    )}
                  </div>
                </div>

                {/* Type of Events Hosted */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Type of Events Hosted
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eventTags.map((tag) => {
                      const active = form.eventTypes.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleEventType(tag)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            active
                              ? "bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-[#191022]"
                              : "bg-[#231630] text-slate-400 border border-gray-700 hover:border-slate-500"
                          }`}
                        >
                          {active && (
                            <span className="material-icons text-sm">check</span>
                          )}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <p className={`mt-1.5 text-xs ${errors.eventTypes ? "text-red-400" : "text-slate-600"}`}>
                    {errors.eventTypes
                      ? "Please select at least one event type."
                      : "Select all that apply"}
                  </p>
                </div>

                {/* Technical Equipment */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Technical Equipment Available
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Pioneer CDJ-3000, Allen & Heath mixer, JBL VTX line array..."
                    value={form.equipment}
                    onChange={(e) => handleChange("equipment", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 border border-gray-700/50 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>

                {/* Website or Social Link */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Website or Social Link
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                      https://
                    </span>
                    <input
                      type="url"
                      placeholder="yourvenuesite.com"
                      value={form.websiteLink}
                      onChange={(e) => handleChange("websiteLink", e.target.value)}
                      className="w-full pl-[4.5rem] pr-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 border border-gray-700/50 outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                {/* Account Credentials */}
                <div className="border-t border-slate-700/50 pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-4">
                    Account Credentials
                  </p>
                  <div className="flex flex-col gap-3">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                          email
                        </span>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 outline-none transition-all ${errors.email ? "ring-2 ring-red-500 border-red-500" : "border-gray-700/50 focus:ring-2 focus:ring-primary"}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">
                          {typeof errors.email === "string" ? errors.email : "Email is required."}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Create Password
                      </label>
                      <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                          lock
                        </span>
                        <input
                          type="password"
                          placeholder="Min. 8 characters"
                          value={form.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2d1e3d] text-white placeholder:text-slate-600 outline-none transition-all ${errors.password ? "ring-2 ring-red-500 border-red-500" : "border-gray-700/50 focus:ring-2 focus:ring-primary"}`}
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-400">
                          {typeof errors.password === "string" ? errors.password : "Password is required."}
                        </p>
                      )}
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => handleChange("agreeTerms", e.target.checked as unknown as string)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-[#231630] text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-400">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:text-primary-light transition-colors">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:text-primary-light transition-colors">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-xs text-red-400">
                        {typeof errors.agreeTerms === "string" ? errors.agreeTerms : "You must agree to the terms."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-icons animate-spin text-sm">refresh</span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Venue Profile
                      <span className="material-icons text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
