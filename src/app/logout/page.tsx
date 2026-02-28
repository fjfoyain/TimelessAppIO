"use client";

import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

export default function LogoutPage() {
  useEffect(() => {
    signOut().catch(() => {
      // Already logged out or error - still show the logout page
    });
  }, []);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-10 text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <span className="material-icons text-4xl text-primary-light">waving_hand</span>
              </div>
            </div>

            {/* Content */}
            <h1 className="text-3xl font-bold text-white mb-3">
              See You Soon!
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              You have been safely logged out of your account. Your session has ended
              and your data is secure.
            </p>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-glow transition-all duration-300"
              >
                <span className="material-icons text-lg">login</span>
                Sign In Again
              </Link>
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 text-slate-300 font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <span className="material-icons text-lg">home</span>
                Back to Home
              </Link>
            </div>

            {/* Decorative bottom line */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="mt-4 text-xs text-slate-600">
              Thanks for being part of the Timeless community.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
