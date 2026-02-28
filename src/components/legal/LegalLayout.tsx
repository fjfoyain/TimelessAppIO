"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const sidebarLinks = [
  { label: "Terms of Service", href: "/terms", icon: "description" },
  { label: "Privacy Policy", href: "/privacy", icon: "verified_user" },
  { label: "Cookie Policy", href: "/terms#cookies", icon: "cookie" },
  { label: "Community Guidelines", href: "/terms#community", icon: "diversity_3" },
];

const supportLink = { label: "Support", href: "/contact", icon: "help" };

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="md:sticky md:top-24 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h1 className="text-white text-lg font-bold">Legal Center</h1>
                  <p className="text-slate-500 text-sm">Manage your legal preferences</p>
                </div>

                <nav className="flex flex-col gap-2">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                          isActive
                            ? "bg-primary/10 border border-primary/20 text-white"
                            : "hover:bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span
                          className={`material-icons text-xl ${
                            isActive ? "text-primary" : "text-slate-500 group-hover:text-primary"
                          } transition-colors`}
                        >
                          {link.icon}
                        </span>
                        <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}

                  <div className="h-px bg-white/5 my-2" />

                  <Link
                    href={supportLink.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors group"
                  >
                    <span className="material-icons text-xl text-slate-500 group-hover:text-primary transition-colors">
                      {supportLink.icon}
                    </span>
                    <span className="text-sm font-medium">{supportLink.label}</span>
                  </Link>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
