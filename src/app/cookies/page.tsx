"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function CookiesPage() {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Persist preferences (localStorage for demo; replace with real cookie logic)
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ essential: true, analytics, marketing })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ essential: true, analytics: true, marketing: true })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-background-dark text-white">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <span className="material-icons text-base">arrow_back</span>
            Back
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">
            Cookie Policy &amp; Preferences
          </h1>
          <p className="mt-3 text-gray-400 leading-relaxed">
            We use cookies to enhance your browsing experience, serve
            personalized content, and analyze our traffic. Manage your
            preferences below. Essential cookies cannot be disabled as they are
            required for the site to function.
          </p>
        </div>

        {/* Cookie categories */}
        <div className="space-y-4">
          {/* Essential */}
          <div className="rounded-2xl border border-white/5 bg-surface-dark p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">Essential Cookies</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Necessary for the website to function properly. These cookies
                  enable core features like authentication and security. They
                  cannot be disabled.
                </p>
              </div>
              {/* Locked toggle */}
              <div className="shrink-0 flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">Always on</span>
                <div className="w-10 h-5 rounded-full bg-primary/40 border border-primary/30 flex items-center justify-end px-0.5 cursor-not-allowed opacity-60">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-2xl border border-white/5 bg-surface-dark p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">Analytics Cookies</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Help us understand how visitors interact with the website by
                  collecting anonymous usage data. This helps us improve the
                  experience for everyone.
                </p>
              </div>
              <button
                onClick={() => setAnalytics((v) => !v)}
                aria-pressed={analytics}
                aria-label="Toggle analytics cookies"
                className={`shrink-0 mt-0.5 w-10 h-5 rounded-full border transition-colors duration-200 flex items-center px-0.5 ${
                  analytics
                    ? "bg-primary border-primary justify-end"
                    : "bg-white/5 border-white/10 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </button>
            </div>
          </div>

          {/* Marketing */}
          <div className="rounded-2xl border border-white/5 bg-surface-dark p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">Marketing Cookies</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Used to track visitors across websites to display relevant and
                  personalized ads. Disabling these will not affect the core
                  functionality of the platform.
                </p>
              </div>
              <button
                onClick={() => setMarketing((v) => !v)}
                aria-pressed={marketing}
                aria-label="Toggle marketing cookies"
                className={`shrink-0 mt-0.5 w-10 h-5 rounded-full border transition-colors duration-200 flex items-center px-0.5 ${
                  marketing
                    ? "bg-primary border-primary justify-end"
                    : "bg-white/5 border-white/10 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto rounded-full border border-white/10 bg-surface-dark px-8 py-3 text-sm font-semibold text-white hover:border-white/20 hover:bg-surface-alt transition-colors"
          >
            Save Preferences
          </button>
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white btn-glow hover:bg-primary-hover transition-colors"
          >
            Accept All
          </button>
        </div>

        {/* Saved confirmation */}
        {saved && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
            <span className="material-icons text-base">check_circle</span>
            Preferences saved successfully.
          </div>
        )}

        {/* Learn more */}
        <p className="mt-10 text-xs text-gray-600 leading-relaxed">
          For more information on how we use cookies and your data, please read
          our{" "}
          <Link href="/privacy" className="underline hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          . You can update these preferences at any time from the footer of any
          page.
        </p>
      </main>

      <Footer />
    </div>
  );
}
