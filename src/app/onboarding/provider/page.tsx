"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const steps = [
  { number: 1, title: "Business Profile" },
  { number: 2, title: "Services Offered" },
  { number: 3, title: "Pricing & Availability" },
];

const businessTypes = [
  "Freelancer / Solo",
  "Agency",
  "Studio",
  "Production Company",
  "Equipment Rental",
  "Consulting",
  "Other",
];

const serviceOptions = [
  "Sound Engineering",
  "Lighting Design",
  "Stage Setup",
  "Equipment Rental",
  "Security Services",
  "Catering",
  "Transportation",
  "Marketing & PR",
  "Event Staffing",
  "Technical Support",
  "Photography",
  "Videography",
];

const scheduleOptions = ["Morning (8am-12pm)", "Afternoon (12pm-5pm)", "Evening (5pm-10pm)", "Night (10pm-4am)", "24/7 Available"];

export default function ProviderOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const toggleSchedule = (slot: string) => {
    setSelectedSchedule((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
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
                  <span className="material-icons text-4xl text-green-400 mb-2">handyman</span>
                  <h2 className="text-2xl font-bold text-white">Business Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Tell us about your business</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sonic Solutions LLC"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Business Type</label>
                  <select className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer">
                    <option value="">Select your business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Business Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe what your business offers..."
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-green-400 mb-2">checklist</span>
                  <h2 className="text-2xl font-bold text-white">Services Offered</h2>
                  <p className="text-sm text-slate-500 mt-1">Select all services you provide</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {serviceOptions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all ${
                        selectedServices.includes(service)
                          ? "bg-green-500/20 border-green-500/50 text-green-400"
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
                  <span className="material-icons text-4xl text-green-400 mb-2">schedule</span>
                  <h2 className="text-2xl font-bold text-white">Pricing & Availability</h2>
                  <p className="text-sm text-slate-500 mt-1">Set your rates and schedule</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Base Hourly Rate (USD)
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
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Day Rate (USD) - Optional
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-input border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Schedule Availability</label>
                  <div className="space-y-2">
                    {scheduleOptions.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSchedule(slot)}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all ${
                          selectedSchedule.includes(slot)
                            ? "bg-green-500/20 border-green-500/50 text-green-400"
                            : "bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-icons text-sm">
                            {selectedSchedule.includes(slot) ? "check_box" : "check_box_outline_blank"}
                          </span>
                          {slot}
                        </span>
                      </button>
                    ))}
                  </div>
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
