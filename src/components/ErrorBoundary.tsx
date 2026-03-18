"use client";

import React from "react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center px-4 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-md">
            <span className="material-icons text-5xl text-primary mb-4 block">error_outline</span>
            <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-slate-400 mb-8">
              An unexpected error occurred. Our team has been notified. Please try navigating back.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition"
              >
                Try Again
              </button>
              <Link
                href="/marketplace"
                className="px-6 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition"
              >
                Go to Marketplace
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
