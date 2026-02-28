"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

type SectionKey = "profile" | "security" | "notifications" | "legal";

function SettingsContent() {
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>("profile");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const toggleSection = (section: SectionKey) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections: { key: SectionKey; icon: string; title: string; description: string }[] = [
    { key: "profile", icon: "person", title: "Profile Customization", description: "Manage your display name, bio, and public profile" },
    { key: "security", icon: "shield", title: "Security", description: "Password, two-factor authentication, and login activity" },
    { key: "notifications", icon: "notifications", title: "Notification Preferences", description: "Control how and when you receive alerts" },
    { key: "legal", icon: "gavel", title: "Legal & Identity", description: "Verify your identity and review legal documents" },
  ];

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Account Settings
            </h1>
            <p className="text-slate-500">
              Manage your account preferences and security settings.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.key}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-colors hover:border-white/10"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-icons text-primary-light">{section.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{section.title}</h3>
                      <p className="text-sm text-slate-500">{section.description}</p>
                    </div>
                  </div>
                  <span
                    className={`material-icons text-slate-500 transition-transform duration-300 ${
                      expandedSection === section.key ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {/* Section Content */}
                {expandedSection === section.key && (
                  <div className="px-6 pb-6 border-t border-white/5 pt-6">
                    {section.key === "profile" && (
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.name || ""}
                            placeholder="Your display name"
                            className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Music Producer, DJ, Sound Engineer"
                            className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Tell others about yourself..."
                            className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">
                            Portfolio Link
                          </label>
                          <input
                            type="url"
                            placeholder="https://your-portfolio.com"
                            className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                          />
                        </div>
                        <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300">
                          Save Changes
                        </button>
                      </div>
                    )}

                    {section.key === "security" && (
                      <div className="space-y-6">
                        <div className="bg-surface-input/50 rounded-xl border border-white/5 p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="material-icons text-slate-400 text-lg">lock</span>
                            <h4 className="text-white font-medium text-sm">Change Password</h4>
                          </div>
                          <p className="text-xs text-slate-500 mb-3">
                            Use the password reset flow to update your password securely via email.
                          </p>
                          <button className="px-4 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition">
                            Send Reset Email
                          </button>
                        </div>

                        <div className="flex items-center justify-between bg-surface-input/50 rounded-xl border border-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-slate-400 text-lg">
                              phone_android
                            </span>
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                Two-Factor Authentication
                              </h4>
                              <p className="text-xs text-slate-500">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                              twoFAEnabled ? "bg-primary" : "bg-slate-700"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                                twoFAEnabled ? "translate-x-6" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {section.key === "notifications" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-surface-input/50 rounded-xl border border-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-slate-400 text-lg">email</span>
                            <div>
                              <h4 className="text-white font-medium text-sm">Email Notifications</h4>
                              <p className="text-xs text-slate-500">
                                Receive updates about bookings, messages, and events
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setEmailNotifications(!emailNotifications)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                              emailNotifications ? "bg-primary" : "bg-slate-700"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                                emailNotifications ? "translate-x-6" : ""
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between bg-surface-input/50 rounded-xl border border-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-slate-400 text-lg">
                              notifications_active
                            </span>
                            <div>
                              <h4 className="text-white font-medium text-sm">Push Notifications</h4>
                              <p className="text-xs text-slate-500">
                                Get real-time alerts on your device
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setPushNotifications(!pushNotifications)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                              pushNotifications ? "bg-primary" : "bg-slate-700"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                                pushNotifications ? "translate-x-6" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {section.key === "legal" && (
                      <div className="space-y-4">
                        <div className="bg-surface-input/50 rounded-xl border border-white/5 p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="material-icons text-slate-400 text-lg">
                              verified_user
                            </span>
                            <h4 className="text-white font-medium text-sm">Identity Verification</h4>
                          </div>
                          <p className="text-xs text-slate-500 mb-3">
                            Verify your identity to unlock premium features and build trust.
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-400">
                            <span className="material-icons text-xs">pending</span>
                            Not Verified
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href="/terms"
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-input/50 border border-white/5 text-sm text-slate-400 hover:text-white hover:border-white/10 transition"
                          >
                            <span className="material-icons text-lg">description</span>
                            Terms of Service
                          </a>
                          <a
                            href="/privacy"
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-input/50 border border-white/5 text-sm text-slate-400 hover:text-white hover:border-white/10 transition"
                          >
                            <span className="material-icons text-lg">policy</span>
                            Privacy Policy
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-red-950/20 backdrop-blur-xl border border-red-500/10 rounded-2xl p-6">
            <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-500 mb-4">
              This will sign you out from all active sessions on every device.
            </p>
            <button className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all">
              <span className="flex items-center gap-2">
                <span className="material-icons text-lg">logout</span>
                Log Out of All Devices
              </span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
