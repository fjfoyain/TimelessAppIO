"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, DragEvent } from "react";
import { signUp, getAuthErrorMessage } from "@/lib/auth";
import { createUserProfile, createArtistProfile } from "@/lib/firestore";
import { UserRole } from "@/types";
import { FirebaseError } from "firebase/app";

/* ─────────── Inline SVG Icons ─────────── */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SoundCloudIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.56 8.87V17h8.76c1.85-.13 3.32-1.67 3.32-3.55 0-1.96-1.6-3.56-3.56-3.56-.47 0-.92.1-1.34.27C18.4 7.38 15.93 5.4 13 5.4c-.63 0-1.24.1-1.82.28v.01c.25.2.42.52.42.88v2.3h-.04zM10.18 9.14V17h.75V8.73c-.26.1-.51.24-.75.41zM8.81 10.37V17h.75v-7.13c-.28.14-.52.32-.75.5zM7.44 17h.75v-5.9c-.25.28-.47.58-.66.9-.03.04-.06.09-.09.14V17zM6.06 17h.75v-4.07c-.11.42-.18.85-.2 1.3v.1L6.06 17zM4.69 17h.75v-2.57c-.21.33-.37.69-.47 1.08L4.69 17zM3.32 17h.75v-1.14c-.12.1-.23.22-.34.34-.14.17-.28.37-.38.57L3.32 17zM1.95 17h.75v-.38l-.22.05c-.2.05-.37.14-.53.24V17zM.58 17h.75v-.12c-.13-.02-.25-.04-.38-.07-.13-.03-.26-.08-.37-.13V17z" />
    </svg>
  );
}

/* ─────────── Types ─────────── */

interface FormData {
  stageName: string;
  genre: string;
  bio: string;
  instagram: string;
  spotify: string;
  soundcloud: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

interface FormErrors {
  stageName?: string;
  genre?: string;
  bio?: string;
  email?: string;
  password?: string;
  agreeTerms?: string;
}

/* ─────────── Component ─────────── */

export default function ArtistRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    stageName: "",
    genre: "",
    bio: "",
    instagram: "",
    spotify: "",
    soundcloud: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    if (!form.stageName.trim()) newErrors.stageName = "Stage name is required.";
    if (!form.genre) newErrors.genre = "Please select a genre.";
    if (!form.bio.trim()) newErrors.bio = "A short bio is required.";
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const credential = await signUp(form.email, form.password, form.stageName);
      const uid = credential.user.uid;

      await createUserProfile({
        uid,
        name: form.stageName,
        email: form.email,
        role: UserRole.ARTIST,
      });

      await createArtistProfile(uid, {
        stageName: form.stageName,
        genre: form.genre,
        bio: form.bio,
        instagram: form.instagram || undefined,
        spotify: form.spotify || undefined,
        soundcloud: form.soundcloud || undefined,
      });

      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setErrors({ email: getAuthErrorMessage(code) });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const inputBase =
    "w-full rounded-lg bg-[#2d1f3b] border border-gray-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";
  const inputError = "border-red-500 focus:ring-red-500";

  return (
    <div className="flex w-full min-h-screen">
      {/* ────────── LEFT SIDE ────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        {/* Background Image */}
        <Image
          src="/images/artist-reg-bg.jpg"
          alt="Artist in studio"
          fill
          className="absolute inset-0 object-cover opacity-60"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191022] via-[#191022]/50 to-transparent" />

        {/* Bottom Content */}
        <div className="relative z-10 mt-auto p-12 pb-16">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="material-icons text-white text-lg">
                graphic_eq
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Timeless
            </span>
          </div>

          {/* Testimonial */}
          <blockquote className="max-w-md">
            <p className="text-lg font-light leading-relaxed text-white/90 italic">
              &ldquo;Timeless connects the dots between raw talent and
              world-class production. It&apos;s where my sound found its
              home.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/40">
                <Image
                  src="/images/testimonial-sarah.jpg"
                  alt="Sarah Jenkins"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Sarah Jenkins
                </p>
                <p className="text-xs text-primary/80">Electronic Producer</p>
              </div>
            </div>
          </blockquote>
        </div>
      </div>

      {/* ────────── RIGHT SIDE ────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 bg-[#191022]">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="material-icons text-white text-lg">
              graphic_eq
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Timeless
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Artist Registration
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Connect with the world&apos;s best studios and producers.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Stage Name + Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stage Name */}
            <div>
              <label
                htmlFor="stageName"
                className="block text-xs font-medium text-slate-400 mb-1.5"
              >
                Stage Name
              </label>
              <input
                id="stageName"
                name="stageName"
                type="text"
                placeholder="e.g. DJ Nova"
                value={form.stageName}
                onChange={handleChange}
                className={`${inputBase} ${errors.stageName ? inputError : ""}`}
              />
              {errors.stageName && (
                <p className="mt-1 text-xs text-red-400">{errors.stageName}</p>
              )}
            </div>

            {/* Primary Genre */}
            <div>
              <label
                htmlFor="genre"
                className="block text-xs font-medium text-slate-400 mb-1.5"
              >
                Primary Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className={`${inputBase} ${errors.genre ? inputError : ""}`}
              >
                <option value="">Select genre</option>
                <option value="techno">Techno</option>
                <option value="house">House</option>
                <option value="hiphop">Hip Hop</option>
                <option value="rnb">R&amp;B</option>
                <option value="pop">Pop</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
              </select>
              {errors.genre && (
                <p className="mt-1 text-xs text-red-400">{errors.genre}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Bio / Description
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Tell us about your sound, influences, and journey..."
              value={form.bio}
              onChange={handleChange}
              className={`${inputBase} resize-none ${errors.bio ? inputError : ""}`}
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-red-400">{errors.bio}</p>
            )}
          </div>

          {/* Social Presence */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Social Presence
            </p>

            <div className="space-y-3">
              {/* Instagram */}
              <div className="flex">
                <div className="flex items-center justify-center w-11 rounded-l-lg border border-r-0 border-gray-700 bg-[#231630]">
                  <InstagramIcon className="text-slate-400" />
                </div>
                <input
                  name="instagram"
                  type="text"
                  placeholder="Instagram username"
                  value={form.instagram}
                  onChange={handleChange}
                  className={`${inputBase} rounded-l-none`}
                />
              </div>

              {/* Spotify */}
              <div className="flex">
                <div className="flex items-center justify-center w-11 rounded-l-lg border border-r-0 border-gray-700 bg-[#231630]">
                  <SpotifyIcon className="text-slate-400" />
                </div>
                <input
                  name="spotify"
                  type="text"
                  placeholder="Spotify artist link"
                  value={form.spotify}
                  onChange={handleChange}
                  className={`${inputBase} rounded-l-none`}
                />
              </div>

              {/* SoundCloud */}
              <div className="flex">
                <div className="flex items-center justify-center w-11 rounded-l-lg border border-r-0 border-gray-700 bg-[#231630]">
                  <SoundCloudIcon className="text-slate-400" />
                </div>
                <input
                  name="soundcloud"
                  type="text"
                  placeholder="SoundCloud profile link"
                  value={form.soundcloud}
                  onChange={handleChange}
                  className={`${inputBase} rounded-l-none`}
                />
              </div>
            </div>
          </div>

          {/* Account Credentials */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Account Credentials
            </p>
            <div className="space-y-3">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    email
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.email ? inputError : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1.5">
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
                    className={`${inputBase} pl-10 ${errors.password ? inputError : ""}`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  name="agreeTerms"
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={handleChange}
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
                <p className="mt-1 text-xs text-red-400">{errors.agreeTerms}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Portfolio / Demo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <span className="material-icons text-3xl text-slate-500">
                cloud_upload
              </span>
              {fileName ? (
                <p className="text-sm text-white font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm text-slate-400">
                    <span className="text-primary font-medium">
                      Upload a file
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-slate-600">
                    MP3, WAV up to 50MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary-hover btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-icons animate-spin text-sm">refresh</span>
                Creating Account...
              </>
            ) : (
              "Complete Registration"
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
        </form>
      </div>
    </div>
  );
}
