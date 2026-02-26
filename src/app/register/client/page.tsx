"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { signUp, getAuthErrorMessage } from "@/lib/auth";
import { createUserProfile, createClientProfile } from "@/lib/firestore";
import { UserRole } from "@/types";
import { FirebaseError } from "firebase/app";

/* ─────────── Types ─────────── */

interface FormData {
  fullName: string;
  company: string;
  role: string;
  interest: string;
  budget: string;
  email: string;
  phone: string;
  password: string;
  agreeTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  company?: string;
  role?: string;
  interest?: string;
  budget?: string;
  email?: string;
  phone?: string;
  password?: string;
  agreeTerms?: string;
}

/* ─────────── Component ─────────── */

export default function ClientRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isIndividual, setIsIndividual] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    company: "",
    role: "",
    interest: "",
    budget: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (isIndividual) {
      if (!form.fullName.trim())
        newErrors.fullName = "Full name is required.";
    } else {
      if (!form.company.trim())
        newErrors.company = "Organization name is required.";
      if (!form.role.trim()) newErrors.role = "Your role is required.";
    }
    if (!form.interest) newErrors.interest = "Please select an interest.";
    if (!form.budget) newErrors.budget = "Please select a budget range.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!form.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const displayName = isIndividual ? form.fullName : form.company;
    try {
      const credential = await signUp(form.email, form.password, displayName);
      const uid = credential.user.uid;

      await createUserProfile({
        uid,
        name: displayName,
        email: form.email,
        role: UserRole.CLIENT,
      });

      await createClientProfile(uid, {
        company: isIndividual ? undefined : form.company,
        role: isIndividual ? undefined : form.role,
        interest: form.interest,
        budget: form.budget,
        phone: form.phone || undefined,
        clientType: isIndividual ? "individual" : "organization",
        fullName: isIndividual ? form.fullName : undefined,
      });

      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setErrors({ email: getAuthErrorMessage(code) });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-lg bg-[#231630] border border-slate-700 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";
  const inputError = "border-red-500 focus:ring-red-500";

  return (
    <div className="flex w-full min-h-screen">
      {/* ────────── LEFT SIDE ────────── */}
      <div className="hidden md:flex w-1/2 lg:w-5/12 relative bg-[#191022] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/client-reg-bg.jpg"
          alt="Client experience"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191022] via-primary/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
            <span className="material-icons text-primary text-sm">
              auto_awesome
            </span>
            <span className="text-xs font-semibold text-primary-light tracking-wide">
              Client Portal
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Curate unforgettable{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              experiences.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 text-base text-slate-300 font-light leading-relaxed max-w-md">
            Join a network of industry-leading organizers, labels, and brands.
            Access verified artists, manage bookings, and bring your creative
            vision to life with Timeless.
          </p>

          {/* Trust Indicators */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <Image
                src="/images/avatar-producer.jpg"
                alt="Client"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-[#191022] object-cover"
              />
              <Image
                src="/images/avatar-dj.jpg"
                alt="Client"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-[#191022] object-cover"
              />
              <Image
                src="/images/avatar-engineer.jpg"
                alt="Client"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-[#191022] object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-[#191022] bg-primary/20 text-xs font-bold text-primary-light">
                +2k
              </span>
              <p className="text-xs text-slate-400">
                Trusted by top organizers worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative purple glow blob */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      </div>

      {/* ────────── RIGHT SIDE ────────── */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-[#191022]">
        {/* Mobile Header */}
        <p className="text-primary font-bold text-lg tracking-tight mb-2 md:hidden">
          Timeless.
        </p>

        {/* Desktop Brand */}
        <p className="hidden md:block text-primary font-bold text-lg tracking-tight mb-4">
          Timeless.
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Join as a Client
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Create an account to start booking talent and managing productions.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* ── Client Type Toggle ── */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <button
                type="button"
                role="switch"
                aria-checked={isIndividual}
                onClick={() => {
                  setIsIndividual((prev) => !prev);
                  setErrors({});
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  isIndividual ? "bg-primary" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    isIndividual ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                I&apos;m registering as an individual
              </span>
            </label>
          </div>

          {/* ── Details Section ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-700/50 mb-5">
              {isIndividual ? "Personal Details" : "Organization Details"}
            </h3>
            <div className="space-y-4">
              {isIndividual ? (
                /* ── Individual: Full Name ── */
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      person
                    </span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.fullName ? inputError : ""}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.fullName}
                    </p>
                  )}
                </div>
              ) : (
                /* ── Organization: Company + Role ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      Company / Organization
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        business
                      </span>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Acme Productions"
                        value={form.company}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.company ? inputError : ""}`}
                      />
                    </div>
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      Your Role
                    </label>
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        badge
                      </span>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        placeholder="e.g. Event Director"
                        value={form.role}
                        onChange={handleChange}
                        className={`${inputBase} ${errors.role ? inputError : ""}`}
                      />
                    </div>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-400">{errors.role}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Interest */}
                <div>
                  <label
                    htmlFor="interest"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Primary Interest
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      interests
                    </span>
                    <select
                      id="interest"
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className={`${inputBase} appearance-none ${errors.interest ? inputError : ""}`}
                    >
                      <option value="">Select interest</option>
                      <option value="events">Event Production</option>
                      <option value="booking">Artist Booking</option>
                      <option value="recording">Recording Sessions</option>
                      <option value="brand">Brand Partnerships</option>
                      <option value="licensing">Music Licensing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.interest && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.interest}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <label
                    htmlFor="budget"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      attach_money
                    </span>
                    <select
                      id="budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className={`${inputBase} appearance-none ${errors.budget ? inputError : ""}`}
                    >
                      <option value="">Select range</option>
                      <option value="under5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                  </div>
                  {errors.budget && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.budget}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Contact Information ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-700/50 mb-5">
              Contact Information
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-400 mb-1.5"
                >
                  {isIndividual ? "Email Address" : "Work Email"}
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    email
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={isIndividual ? "you@example.com" : "you@company.com"}
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputBase} ${errors.email ? inputError : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      phone
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.phone ? inputError : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-400 mb-1.5"
                  >
                    Create Password
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      lock
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.password ? inputError : ""}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                name="agreeTerms"
                type="checkbox"
                checked={form.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-[#231630] text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-sm text-slate-400">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="mt-1 text-xs text-red-400">{errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-icons animate-spin text-sm">refresh</span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="material-icons text-lg">arrow_forward</span>
              </>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              Log in
            </Link>
          </p>

          {/* SSL Badge */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="material-icons text-slate-600 text-sm">lock</span>
            <p className="text-xs text-slate-600">
              Secure 256-bit SSL encrypted registration
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
