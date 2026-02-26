"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { signUp, getAuthErrorMessage } from "@/lib/auth";
import { createUserProfile, createTalentProfile } from "@/lib/firestore";
import { UserRole } from "@/types";
import { FirebaseError } from "firebase/app";

/* ─────────── Types ─────────── */

type ExperienceLevel = "newcomer" | "pro" | "veteran";
type RatePer = "Hour" | "Day" | "Project";

interface TalentFormData {
  fullName: string;
  category: string;
  experience: ExperienceLevel;
  baseRate: string;
  ratePer: RatePer;
  portfolioLink: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

/* ─────────── Constants ─────────── */

const categories = [
  "Concert Photographer",
  "Videographer/Editor",
  "Lighting Technician",
  "Sound Engineer",
  "Event Promoter",
] as const;

const experienceLevels: { value: ExperienceLevel; label: string; sub: string }[] = [
  { value: "newcomer", label: "Newcomer", sub: "1-2 yrs" },
  { value: "pro", label: "Pro", sub: "3-5 yrs" },
  { value: "veteran", label: "Veteran", sub: "5+ yrs" },
];

/* ─────────── Page ─────────── */

export default function TalentRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TalentFormData>({
    fullName: "",
    category: "",
    experience: "pro",
    baseRate: "",
    ratePer: "Hour",
    portfolioLink: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TalentFormData, boolean | string>>>({});

  function handleChange(field: keyof TalentFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: Partial<Record<keyof TalentFormData, boolean | string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = true;
    if (!form.category) newErrors.category = true;
    if (!form.baseRate.trim()) newErrors.baseRate = true;
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
      const credential = await signUp(form.email, form.password, form.fullName);
      const uid = credential.user.uid;

      await createUserProfile({
        uid,
        name: form.fullName,
        email: form.email,
        role: UserRole.TALENT,
      });

      await createTalentProfile(uid, {
        fullName: form.fullName,
        category: form.category,
        experience: form.experience,
        baseRate: parseFloat(form.baseRate),
        ratePer: form.ratePer,
        portfolioLink: form.portfolioLink || undefined,
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
  const ring = (field: keyof TalentFormData) =>
    errors[field]
      ? "ring-2 ring-red-500 border-red-500"
      : "border-slate-700 focus:ring-2 focus:ring-primary";

  /* ─────────── Render ─────────── */

  return (
    <div className="flex w-full min-h-screen">
      {/* ══════════════ LEFT SIDE ══════════════ */}
      <div className="hidden lg:block lg:w-1/2 relative h-auto min-h-screen bg-[#231630]">
        {/* Background Image */}
        <Image
          src="/images/talent-reg-bg.jpg"
          alt="Creative professionals at work"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191022] via-primary/20 to-[#191022]/80 mix-blend-multiply" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          {/* Top: Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <span className="material-icons text-white text-xl">equalizer</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Timeless</span>
          </div>

          {/* Middle: Hero Content */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex items-center self-start gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="text-xs font-medium text-primary-light tracking-wide">
                Join 12,000+ Creative Professionals
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold text-white leading-tight">
              Amplify your career
              <br />
              behind the scenes.
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Connect with top studios, artists, and venues. Showcase your craft, land gigs, and
              grow your reputation in the music industry.
            </p>

            {/* Avatar Stack */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#231630]">
                  <Image
                    src="/images/avatar-producer.jpg"
                    alt="Producer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#231630]">
                  <Image
                    src="/images/avatar-dj.jpg"
                    alt="DJ"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#231630]">
                  <Image
                    src="/images/avatar-engineer.jpg"
                    alt="Engineer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border-2 border-[#231630] text-xs font-bold text-primary-light">
                  +2k
                </div>
              </div>
              <span className="text-sm text-slate-400">Verified talents joined this week</span>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <p className="text-xs text-slate-600">
            &copy; 2023 Timeless Platform Inc.
          </p>
        </div>
      </div>

      {/* ══════════════ RIGHT SIDE ══════════════ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 bg-[#191022]">
        {/* Mobile Logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <span className="material-icons text-white text-xl">equalizer</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Timeless</span>
        </div>

        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">Create Talent Profile</h2>
          <p className="text-slate-400 mb-8">
            Start showcasing your portfolio to network with the industry.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {/* Full Name / Stage Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Name / Stage Name
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#231630] text-white placeholder:text-slate-600 outline-none transition-all ${ring("fullName")}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-400">Full name is required.</p>
                )}
              </div>

              {/* Professional Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Professional Category
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    work
                  </span>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#231630] text-white outline-none appearance-none transition-all ${ring("category")} ${!form.category ? "text-slate-600" : ""}`}
                  >
                    <option value="" disabled>
                      Select your specialty
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                    expand_more
                  </span>
                </div>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-400">Please select a category.</p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {experienceLevels.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => handleChange("experience", lvl.value)}
                      className={`flex flex-col items-center gap-0.5 rounded-lg border px-3 py-3 text-center transition-all ${
                        form.experience === lvl.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-700 bg-[#231630] text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-sm font-semibold">{lvl.label}</span>
                      <span className="text-[11px] opacity-70">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Base Rate + Per */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Base Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="150"
                      value={form.baseRate}
                      onChange={(e) => handleChange("baseRate", e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg bg-[#231630] text-white placeholder:text-slate-600 outline-none transition-all ${ring("baseRate")}`}
                    />
                  </div>
                  {errors.baseRate && (
                    <p className="mt-1 text-xs text-red-400">Rate is required.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Per</label>
                  <div className="relative">
                    <select
                      value={form.ratePer}
                      onChange={(e) => handleChange("ratePer", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#231630] text-white border-slate-700 border outline-none appearance-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="Hour">Hour</option>
                      <option value="Day">Day</option>
                      <option value="Project">Project</option>
                    </select>
                    <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Portfolio Link
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                    https://
                  </span>
                  <input
                    type="url"
                    placeholder="yoursite.com"
                    value={form.portfolioLink}
                    onChange={(e) => handleChange("portfolioLink", e.target.value)}
                    className="w-full pl-[4.5rem] pr-4 py-3 rounded-lg bg-[#231630] text-white placeholder:text-slate-600 border border-slate-700 outline-none focus:ring-2 focus:ring-primary transition-all"
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
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#231630] text-white placeholder:text-slate-600 outline-none transition-all ${errors.email ? "ring-2 ring-red-500 border-red-500" : "border-slate-700 focus:ring-2 focus:ring-primary"}`}
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
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#231630] text-white placeholder:text-slate-600 outline-none transition-all ${errors.password ? "ring-2 ring-red-500 border-red-500" : "border-slate-700 focus:ring-2 focus:ring-primary"}`}
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
                    Complete Registration
                    <span className="material-icons text-lg">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Log In Link */}
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                  Log in
                </Link>
              </p>
            </form>
        </div>
      </div>
    </div>
  );
}
