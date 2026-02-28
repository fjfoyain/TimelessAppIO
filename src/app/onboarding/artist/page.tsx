"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const steps = [
  { number: 1, title: "Complete Your Profile" },
  { number: 2, title: "Add Your Work" },
  { number: 3, title: "Set Your Rates" },
];

const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Full-time", "Part-time"];

export default function ArtistOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-primary to-primary-light text-white"
                        : "bg-surface-dark border border-white/10 text-slate-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <span className="material-icons text-sm">check</span>
                    ) : (
                      step.number
                    )}
                  </div>
                  {step.number < 3 && (
                    <div
                      className={`w-16 sm:w-24 h-0.5 ${
                        currentStep > step.number ? "bg-primary" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500">
              Step {currentStep} of 3
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-primary-light mb-2">person</span>
                  <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Let the world know who you are</p>
                </div>

                {/* Avatar Upload */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-surface-input border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition">
                    <span className="material-icons text-2xl text-slate-600">add_a_photo</span>
                    <span className="text-[10px] text-slate-600 mt-1">Upload</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Artist / Stage Name</label>
                  <input
                    type="text"
                    placeholder="e.g. DJ Nova, The Frequency"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Tell your story. What inspires your music?"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-primary-light mb-2">collections</span>
                  <h2 className="text-2xl font-bold text-white">Add Your Work</h2>
                  <p className="text-sm text-slate-500 mt-1">Showcase your best tracks, mixes, or performances</p>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <span className="material-icons text-5xl text-slate-600 mb-3">cloud_upload</span>
                  <p className="text-white font-medium mb-1">Drag and drop your files</p>
                  <p className="text-sm text-slate-500 mb-4">MP3, WAV, MP4, JPG, PNG up to 50MB each</p>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition"
                  >
                    Browse Files
                  </button>
                </div>

                {/* Portfolio Link */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Or link your portfolio
                  </label>
                  <input
                    type="url"
                    placeholder="https://soundcloud.com/your-profile"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-primary-light mb-2">monetization_on</span>
                  <h2 className="text-2xl font-bold text-white">Set Your Rates</h2>
                  <p className="text-sm text-slate-500 mt-1">Define your pricing and availability</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Hourly Rate (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Availability</label>
                  <div className="flex flex-wrap gap-2">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="px-4 py-2 rounded-lg text-sm font-medium border bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-primary/30 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-white/20 transition"
                >
                  <span className="material-icons text-sm">arrow_back</span>
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300"
                >
                  Next
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300"
                >
                  Finish
                  <span className="material-icons text-sm">check</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
