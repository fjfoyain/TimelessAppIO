"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import Footer from "@/components/landing/Footer";
import { mockTalents } from "@/data/mockTalents";

function getAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export default function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const match = mockTalents.find((t) => t.talent.id === id);

  if (!match) {
    notFound();
  }

  const { talent, user } = match;
  const avgRating = getAverageRating(talent.reviews);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/marketplace" className="hover:text-primary transition-colors">
              Marketplace
            </Link>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="text-white">{user.name}</span>
          </nav>

          {/* Hero */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 flex-shrink-0">
              <Image
                src={user.avatar || "/images/avatar-producer.jpg"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{user.name}</h1>
                {talent.isVerified && (
                  <span className="material-icons text-primary text-2xl">verified</span>
                )}
              </div>
              <p className="text-lg text-primary-light font-medium mt-1">{talent.category}</p>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <span className="material-icons text-xs">place</span>
                {talent.city}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <span className="material-icons text-yellow-400 text-sm">star</span>
                  <span className="text-white font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-slate-500 text-sm">({talent.reviews.length} reviews)</span>
                </div>
                <div className="text-sm text-slate-400">{talent.jobsCompleted} jobs completed</div>
                <div className="text-sm text-slate-400">{talent.responseRate}% response rate</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {talent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Badge */}
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center min-w-[140px] flex-shrink-0">
              <p className="text-3xl font-bold text-white">${talent.hourlyRate}</p>
              <p className="text-xs text-slate-500">per hour</p>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed">{talent.bio}</p>
              </section>

              {/* Portfolio */}
              {talent.portfolio.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {talent.portfolio.map((item, i) => (
                      <div
                        key={i}
                        className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-white/5"
                      >
                        <Image
                          src={item.url}
                          alt={item.caption || "Portfolio item"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="material-icons text-white text-3xl">zoom_in</span>
                        </div>
                        {item.caption && (
                          <p className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Availability */}
              {talent.availability && talent.availability.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">Availability</h2>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span
                        key={day}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          talent.availability?.includes(day)
                            ? "bg-primary/10 border-primary/30 text-primary-light"
                            : "bg-surface-dark/30 border-white/5 text-slate-600"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Reviews ({talent.reviews.length})
                </h2>
                <div className="space-y-4">
                  {talent.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary-light">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{review.author}</p>
                            <p className="text-xs text-slate-500">{review.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i} className="material-icons text-yellow-400 text-sm">
                              star
                            </span>
                          ))}
                          {Array.from({ length: 5 - review.rating }).map((_, i) => (
                            <span key={i} className="material-icons text-slate-700 text-sm">
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (Sticky) */}
            <div className="space-y-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Service Plans */}
                {talent.servicePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <h4 className="text-lg font-semibold text-white">{plan.title}</h4>
                    <p className="text-2xl font-bold text-primary mt-2">${plan.price}</p>
                    <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                    <ul className="mt-4 space-y-2">
                      {plan.includes.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-slate-300"
                        >
                          <span className="material-icons text-green-400 text-sm">
                            check_circle
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full mt-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition btn-glow">
                      Select Plan
                    </button>
                  </div>
                ))}

                {/* Contact CTA */}
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <span className="material-icons text-primary text-3xl">chat</span>
                  <h4 className="text-lg font-semibold text-white mt-2">Interested?</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Reach out to discuss your project
                  </p>
                  <button className="w-full mt-4 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition">
                    Contact {user.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
