"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const categories = [
  "General Inquiry",
  "Billing & Payments",
  "Technical Support",
  "Dispute Resolution",
  "Account Issues",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="flex flex-col gap-4 text-center items-center py-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">
              Customer Care
            </span>
            <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">
              Contact & Support
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              We are dedicated to providing you with exceptional service. For immediate assistance,
              use our urgent channels or send us a message below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-surface-dark/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-12 gap-4">
                    <span className="material-icons text-green-400 text-5xl">check_circle</span>
                    <h3 className="text-white text-2xl font-bold">Message Sent!</h3>
                    <p className="text-slate-400 max-w-md">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          subject: "",
                          category: "General Inquiry",
                          message: "",
                        });
                      }}
                      className="mt-4 px-6 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary-light text-sm font-medium hover:bg-primary/20 transition"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 mb-8">
                      <h3 className="text-white text-2xl font-bold">Send us a message</h3>
                      <p className="text-slate-500">
                        Fill out the form below and our team will get back to you within 24 hours.
                      </p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                          <span className="text-white text-sm font-semibold">Full Name</span>
                          <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Alexander Smith"
                            className="w-full rounded-lg bg-surface-input border border-white/10 px-4 h-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-white text-sm font-semibold">Email Address</span>
                          <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. alex@example.com"
                            className="w-full rounded-lg bg-surface-input border border-white/10 px-4 h-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                          <span className="text-white text-sm font-semibold">Subject</span>
                          <input
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief summary of issue"
                            className="w-full rounded-lg bg-surface-input border border-white/10 px-4 h-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-white text-sm font-semibold">Category</span>
                          <div className="relative">
                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className="w-full rounded-lg bg-surface-input border border-white/10 px-4 h-12 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer text-sm"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xl">
                              expand_more
                            </span>
                          </div>
                        </label>
                      </div>

                      <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-semibold">Message</span>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your issue in detail..."
                          className="w-full rounded-lg bg-surface-input border border-white/10 p-4 min-h-[160px] text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-y text-sm"
                        />
                      </label>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-primary/20"
                        >
                          <span>Send Message</span>
                          <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">
                            send
                          </span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* WhatsApp Concierge */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-800/50 flex flex-col gap-4 relative overflow-hidden group hover:border-green-700/70 transition-colors">
                <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <span className="material-icons text-6xl text-green-400">chat</span>
                </div>
                <div className="flex items-center gap-3 text-green-400">
                  <span className="material-icons">chat_bubble</span>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Instant Support
                  </span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">WhatsApp Concierge</h3>
                  <p className="text-slate-300 text-sm">
                    Chat instantly with our dedicated support team for quick resolutions.
                  </p>
                </div>
                <a
                  href="https://wa.me/593958909112?text=Hi%20Timeless!%20I%20need%20support."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Start Chat
                </a>
              </div>

              {/* Urgent Contacts */}
              <div className="bg-surface-dark/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
                <h3 className="text-white text-lg font-bold">Urgent Contacts</h3>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons">call</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">24/7 Hotline</span>
                    <span className="text-slate-500 text-xs mb-1">
                      For critical account issues
                    </span>
                    <span className="text-primary font-bold">+593 95-890-9112</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons">gavel</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Dispute Center</span>
                    <span className="text-slate-500 text-xs mb-1">
                      Direct line for service disputes
                    </span>
                    <span className="text-primary font-bold">+593 95-890-9112</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Priority Email</span>
                    <span className="text-slate-500 text-xs mb-1">
                      Guaranteed 24hr response time
                    </span>
                    <span className="text-primary font-bold">priority@timeless.com</span>
                  </div>
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-surface-dark rounded-full">
                  <span className="material-icons text-primary">help</span>
                </div>
                <h4 className="text-white font-bold">Have a simple question?</h4>
                <p className="text-slate-500 text-sm">
                  Check our comprehensive FAQ before reaching out.
                </p>
                <a
                  href="/help"
                  className="text-primary text-sm font-bold hover:underline mt-1"
                >
                  Visit Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
