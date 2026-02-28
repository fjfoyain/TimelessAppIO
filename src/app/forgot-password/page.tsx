"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setStep(2);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <AnimatedBackground />
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 w-full relative z-10">
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-16">
          {/* Left Column: Context / Marketing */}
          <div className="hidden lg:flex flex-col gap-8 sticky top-32">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                  Secure Access &
                </span>
                <br />
                <span className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                  Session Control
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-md">
                Recover your account securely. Our multi-factor verification ensures only you can
                access your data.
              </p>
            </div>

            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="material-icons text-primary text-2xl">lock_reset</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Encrypted Reset</h3>
                <p className="text-sm text-slate-400">
                  Links are one-time use and expire in 15 minutes.
                </p>
              </div>
            </div>

            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="material-icons text-primary text-2xl">shield</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Account Protection</h3>
                <p className="text-sm text-slate-400">
                  We monitor for suspicious activity during recovery.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Flow Steps */}
          <div className="flex flex-col gap-8 w-full max-w-[520px] mx-auto lg:mx-0">
            {/* Step 1: Forgot Password */}
            {step === 1 && (
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Step 1
                  </span>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                  <p className="text-slate-400">
                    Enter the email associated with your account and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSendReset}>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-white ml-1">Email Address</span>
                    <div className="relative">
                      <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-surface-input border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      />
                    </div>
                  </label>

                  {error && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <span className="material-icons text-sm">error</span>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-glow hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="material-icons animate-spin text-xl">
                        progress_activity
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-icons text-base">arrow_back</span>
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* Step 2: Check Email */}
            {step === 2 && (
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/30 shadow-[0_0_30px_-5px_rgba(127,19,236,0.4)]">
                  <span className="material-icons text-primary text-4xl">mark_email_unread</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="text-slate-200 font-medium">{email}</span>.
                </p>

                <div className="flex flex-col gap-3">
                  <p className="text-sm text-slate-500">
                    Follow the link in your email to reset your password. The link will expire in 15
                    minutes.
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
                    <span>Didn&apos;t receive the email?</span>
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary hover:text-primary-light font-medium"
                    >
                      Try again
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/login"
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-icons text-base">arrow_back</span>
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* Step 3: Visual Preview (non-interactive) */}
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl opacity-50 pointer-events-none relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Step 3
                </span>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Create new password</h2>
                <p className="text-slate-400">
                  Your new password must be different from previous used passwords.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white ml-1">New Password</span>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      lock
                    </span>
                    <div className="w-full bg-surface-input border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-500 text-sm">
                      ••••••••••
                    </div>
                  </div>
                  <div className="flex gap-1 mt-1 px-1">
                    <div className="h-1 flex-1 rounded-full bg-green-500" />
                    <div className="h-1 flex-1 rounded-full bg-green-500" />
                    <div className="h-1 flex-1 rounded-full bg-green-500" />
                    <div className="h-1 flex-1 rounded-full bg-white/10" />
                  </div>
                  <span className="text-xs text-green-500 px-1 font-medium">Strong password</span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white ml-1">Confirm Password</span>
                  <div className="w-full bg-surface-input border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-500 text-sm">
                    ••••••••••
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    Min 8 characters
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    At least one special character
                  </div>
                </div>

                <div className="mt-4 w-full bg-primary text-white font-bold py-3.5 rounded-xl text-center text-sm">
                  Reset Password
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full border-t border-white/5 bg-background-dark py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Timeless. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
