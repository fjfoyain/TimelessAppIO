"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

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

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background-dark">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r border-white/5 bg-surface-dark/80 backdrop-blur-xl flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 h-16 border-b border-white/5">
            <span className="material-icons text-primary text-2xl">
              admin_panel_settings
            </span>
            <span className="text-lg font-bold tracking-tighter text-white">
              TIMELESS
            </span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-primary-light bg-primary/10 px-2 py-0.5 rounded-full">
              Admin
            </span>
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
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
