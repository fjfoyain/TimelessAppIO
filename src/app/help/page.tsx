"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const topics = [
  { title: "Account & Security", description: "Login, password reset, 2FA, and account settings", icon: "shield", color: "from-purple-600 to-violet-600" },
  { title: "Payments & Billing", description: "Invoices, refunds, payment methods, and pricing", icon: "payments", color: "from-green-600 to-emerald-600" },
  { title: "Bookings & Reservations", description: "How to book, cancel, reschedule, and manage events", icon: "calendar_month", color: "from-cyan-600 to-blue-600" },
  { title: "Community Guidelines", description: "Rules, policies, and best practices for members", icon: "groups", color: "from-pink-600 to-rose-600" },
  { title: "Trust & Safety", description: "Reporting, verification, and dispute resolution", icon: "verified_user", color: "from-amber-600 to-orange-600" },
  { title: "API & Integrations", description: "Developer docs, webhooks, and third-party tools", icon: "code", color: "from-fuchsia-600 to-pink-600" },
];

const tutorials = [
  { title: "Getting Started with Timeless", duration: "5:30", icon: "play_circle" },
  { title: "How to Book Your First Talent", duration: "3:45", icon: "play_circle" },
  { title: "Setting Up Your Artist Profile", duration: "4:15", icon: "play_circle" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="text-center mb-16">
            <span className="material-icons text-primary-light text-5xl mb-4">support_agent</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How can we help you today?
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              Search our knowledge base or browse topics below to find what you need.
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <span className="material-icons absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-surface-dark/50 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
              />
            </div>
          </section>

          {/* Browse by Topic */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Browse by Topic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.title}
                  className="group bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-left hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4`}
                  >
                    <span className="material-icons text-white text-xl">{topic.icon}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-primary-light transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-slate-500">{topic.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Platform Tutorials */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Platform Tutorials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tutorials.map((tutorial) => (
                <button
                  key={tutorial.title}
                  className="group bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300"
                >
                  {/* Video Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-accent-cyan/10 flex items-center justify-center relative">
                    <span className="material-icons text-5xl text-white/40 group-hover:text-primary-light group-hover:scale-110 transition-all duration-300">
                      {tutorial.icon}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-xs text-white font-mono">
                      {tutorial.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary-light transition-colors">
                      {tutorial.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Need More Help */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-icons text-primary-light text-2xl">email</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Submit a Ticket</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Can&apos;t find what you need? Our support team is here to help.
                </p>
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300">
                  Contact Support
                </button>
              </div>

              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-4">
                  <span className="material-icons text-accent-cyan text-2xl">forum</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Connect with other members and share tips and advice.
                </p>
                <button className="px-6 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-all">
                  Visit Forum
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
