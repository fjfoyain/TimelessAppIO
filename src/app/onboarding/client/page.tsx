"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const steps = [
  { number: 1, title: "Tell us about you" },
  { number: 2, title: "What are you looking for?" },
  { number: 3, title: "Set your budget" },
];

const industries = [
  "Music & Entertainment",
  "Film & Television",
  "Corporate Events",
  "Hospitality",
  "Fashion & Lifestyle",
  "Sports",
  "Technology",
  "Other",
];

const serviceTypes = [
  "DJs & Musicians",
  "Sound Engineers",
  "Event Planning",
  "Photography",
  "Videography",
  "Stage Design",
  "Marketing & Promotion",
  "Venue Rental",
  "Catering",
  "Security",
];

const budgetRanges = [
  { label: "Under $1,000", value: "under1k" },
  { label: "$1,000 - $5,000", value: "1k-5k" },
  { label: "$5,000 - $15,000", value: "5k-15k" },
  { label: "$15,000 - $50,000", value: "15k-50k" },
  { label: "$50,000+", value: "50k+" },
];

export default function ClientOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

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
                  <span className="material-icons text-4xl text-amber-400 mb-2">business</span>
                  <h2 className="text-2xl font-bold text-white">Tell Us About You</h2>
                  <p className="text-sm text-slate-500 mt-1">Help us personalize your experience</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Company / Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Neon Events LLC"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                  <select className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer">
                    <option value="">Select your industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-amber-400 mb-2">search</span>
                  <h2 className="text-2xl font-bold text-white">What Are You Looking For?</h2>
                  <p className="text-sm text-slate-500 mt-1">Select the services you need (pick multiple)</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {serviceTypes.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all ${
                        selectedServices.includes(service)
                          ? "bg-primary/20 border-primary/50 text-primary-light"
                          : "bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-icons text-sm">
                          {selectedServices.includes(service) ? "check_box" : "check_box_outline_blank"}
                        </span>
                        {service}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-amber-400 mb-2">account_balance_wallet</span>
                  <h2 className="text-2xl font-bold text-white">Set Your Budget</h2>
                  <p className="text-sm text-slate-500 mt-1">What is your typical project budget range?</p>
                </div>

                <div className="space-y-3">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => setSelectedBudget(range.value)}
                      className={`w-full px-5 py-4 rounded-xl text-sm font-medium border text-left transition-all flex items-center justify-between ${
                        selectedBudget === range.value
                          ? "bg-primary/20 border-primary/50 text-primary-light"
                          : "bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span>{range.label}</span>
                      <span
                        className={`material-icons text-lg ${
                          selectedBudget === range.value ? "text-primary-light" : "text-slate-600"
                        }`}
                      >
                        {selectedBudget === range.value ? "radio_button_checked" : "radio_button_unchecked"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
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
