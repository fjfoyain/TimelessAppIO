"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const steps = [
  { number: 1, title: "Venue Details" },
  { number: 2, title: "Amenities & Features" },
  { number: 3, title: "Photos & Pricing" },
];

const venueTypes = [
  "Nightclub",
  "Concert Hall",
  "Rooftop Bar",
  "Event Space",
  "Recording Studio",
  "Outdoor Amphitheater",
  "Private Lounge",
  "Restaurant / Bar",
  "Gallery Space",
  "Warehouse",
  "Other",
];

const amenities = [
  "Sound System",
  "Lighting Rig",
  "DJ Booth",
  "Stage",
  "Green Room",
  "Bar / Drinks",
  "Kitchen / Catering",
  "Parking",
  "Wheelchair Access",
  "Wi-Fi",
  "Security",
  "Coat Check",
  "VIP Area",
  "Outdoor Space",
  "Air Conditioning",
  "Loading Dock",
];

const pricingTiers = [
  { label: "Hourly", placeholder: "e.g. 250" },
  { label: "Half Day (4 hrs)", placeholder: "e.g. 800" },
  { label: "Full Day (8 hrs)", placeholder: "e.g. 1,500" },
  { label: "Weekend Rate", placeholder: "e.g. 3,000" },
];

export default function VenueOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
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
                  <span className="material-icons text-4xl text-pink-400 mb-2">location_on</span>
                  <h2 className="text-2xl font-bold text-white">Venue Details</h2>
                  <p className="text-sm text-slate-500 mt-1">Tell us about your venue</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Venue Name</label>
                  <input
                    type="text"
                    placeholder="e.g. The Underground, Echo Lounge"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Venue Type</label>
                  <select className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer">
                    <option value="">Select venue type</option>
                    {venueTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Maximum Capacity</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Full venue address"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-pink-400 mb-2">star</span>
                  <h2 className="text-2xl font-bold text-white">Amenities & Features</h2>
                  <p className="text-sm text-slate-500 mt-1">Select everything your venue offers</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all ${
                        selectedAmenities.includes(amenity)
                          ? "bg-pink-500/20 border-pink-500/50 text-pink-400"
                          : "bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-icons text-sm">
                          {selectedAmenities.includes(amenity) ? "check_box" : "check_box_outline_blank"}
                        </span>
                        {amenity}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-4xl text-pink-400 mb-2">photo_camera</span>
                  <h2 className="text-2xl font-bold text-white">Photos & Pricing</h2>
                  <p className="text-sm text-slate-500 mt-1">Upload venue photos and set your pricing</p>
                </div>

                {/* Photo Upload */}
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-pink-500/30 transition-colors cursor-pointer">
                  <span className="material-icons text-5xl text-slate-600 mb-3">add_photo_alternate</span>
                  <p className="text-white font-medium mb-1">Upload Venue Photos</p>
                  <p className="text-sm text-slate-500 mb-4">Add at least 3 photos of your venue</p>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition"
                  >
                    Browse Files
                  </button>
                </div>

                {/* Pricing Tiers */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Pricing Tiers (USD)</label>
                  <div className="space-y-3">
                    {pricingTiers.map((tier) => (
                      <div key={tier.label} className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 w-32 shrink-0">{tier.label}</span>
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                          <input
                            type="number"
                            min="0"
                            placeholder={tier.placeholder}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-input border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                          />
                        </div>
                      </div>
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
