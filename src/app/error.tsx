"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-deep flex items-center justify-center px-4">
      <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-10 text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
            <span className="material-icons text-3xl text-red-400">error_outline</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. You can try
          again, or head back to the dashboard.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition btn-glow"
          >
            <span className="material-icons text-lg">refresh</span>
            Try again
          </button>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 text-slate-300 font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition"
          >
            <span className="material-icons text-lg">dashboard</span>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
