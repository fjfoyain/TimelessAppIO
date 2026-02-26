"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

interface NavbarProps {
  activeTab?: "app" | "studio";
}

export default function Navbar({ activeTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background-dark/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="material-icons text-primary text-3xl group-hover:text-primary-light transition-colors">
              hourglass_empty
            </span>
            <span className="text-xl font-bold tracking-tighter text-white">
              TIMELESS
            </span>
          </Link>

          {/* Center: Pill Toggle */}
          <div className="hidden sm:flex items-center rounded-full bg-surface-dark border border-white/10 p-1">
            <Link
              href="/"
              className={`relative px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === "app"
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              App
            </Link>
            <Link
              href="/studio"
              className={`relative px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === "studio"
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Studio
            </Link>
          </div>

          {/* Right: Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/marketplace"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-light">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-white font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                    title="Sign out"
                  >
                    <span className="material-icons text-lg">logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/marketplace"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="#about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-background-dark hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Right: Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-icons text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-surface-dark/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link
              href="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              Marketplace
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors py-2"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 py-2 border-t border-white/5 mt-1 pt-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-light">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-white font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-1 rounded-full border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 text-center hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors py-2"
                >
                  About
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-background-dark text-center hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
