"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
  { label: "Audit Logs", href: "/admin/logs", icon: "receipt_long" },
  { label: "Approvals", href: "/admin/approvals", icon: "verified" },
  { label: "Categories", href: "/admin/categories", icon: "category" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background-dark">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen border-r border-white/5 bg-surface-dark/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 h-16 border-b border-white/5">
            <Image src="/images/logo.svg" alt="TIMELESS" width={110} height={32} className="h-7 w-auto" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-light bg-primary/10 px-2 py-0.5 rounded-full">
              Admin
            </span>
            {user?.isSuperUser && (
              <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                Super
              </span>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span
                    className={`material-icons text-xl transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-500 group-hover:text-white"
                    }`}
                  >
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 pb-6">
            <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="material-icons text-sm">info</span>
                <span>Admin Panel v1.0</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-white/5 bg-surface-dark/80 backdrop-blur-xl sticky top-0 z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Open menu"
            >
              <span className="material-icons">menu</span>
            </button>
            <Image src="/images/logo.svg" alt="TIMELESS" width={100} height={28} className="h-6 w-auto" />
          </div>

          <main>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
