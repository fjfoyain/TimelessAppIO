"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-10 text-center">
            {/* Success Animation */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center animate-bounce">
                <span className="material-icons text-4xl text-emerald-400">check_circle</span>
              </div>
            </div>

            {/* Content */}
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome to Timeless!
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Your account has been created successfully. You are now part of the
              ultimate ecosystem connecting artists, venues, and industry talent.
            </p>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-glow transition-all duration-300"
              >
                <span className="material-icons text-lg">dashboard</span>
                Go to Dashboard
              </Link>
              <Link
                href="/marketplace"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 text-slate-300 font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <span className="material-icons text-lg">storefront</span>
                Explore Marketplace
              </Link>
            </div>

            {/* Decorative bottom line */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="mt-4 text-xs text-slate-600">
              Need help getting started?{" "}
              <Link href="/help" className="text-primary-light hover:underline">
                Visit our Help Center
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
