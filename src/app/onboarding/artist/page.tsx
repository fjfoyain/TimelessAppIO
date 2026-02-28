"use client";

import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, updateArtistProfile } from "@/lib/firestore";
import { uploadAvatar, uploadArtistPortfolio } from "@/lib/storage";

const steps = [
  { number: 1, title: "Complete Your Profile" },
  { number: 2, title: "Add Your Work" },
  { number: 3, title: "Set Your Rates" },
];

const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Full-time", "Part-time"];

function ArtistOnboardingContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [stageName, setStageName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [portfolioFiles, setPortfolioFiles] = useState<{ file: File; name: string }[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  // Step 3 state
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  // Submit state
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handlePortfolioSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPortfolioFiles((prev) => [...prev, ...files.map((f) => ({ file: f, name: f.name }))]);
  }

  function handlePortfolioDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setPortfolioFiles((prev) => [...prev, ...files.map((f) => ({ file: f, name: f.name }))]);
  }

  function removePortfolioFile(index: number) {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleAvailability(option: string) {
    setSelectedAvailability((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      // Upload avatar if selected
      let avatarUrl = "";
      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id, avatarFile, setUploadProgress);
      }

      // Update user profile
      const profileUpdate: Record<string, string> = {};
      if (avatarUrl) profileUpdate.avatar = avatarUrl;
      if (bio) profileUpdate.bio = bio;
      if (Object.keys(profileUpdate).length > 0) {
        await updateUserProfile(user.id, profileUpdate);
      }

      // Update artist profile
      const artistUpdate: Record<string, unknown> = {};
      if (stageName) artistUpdate.stageName = stageName;
      if (bio) artistUpdate.bio = bio;
      if (hourlyRate) artistUpdate.baseRate = parseFloat(hourlyRate) || 0;
      if (selectedAvailability.length > 0) artistUpdate.availability = selectedAvailability;
      if (portfolioLink) artistUpdate.portfolioLink = portfolioLink;
      if (Object.keys(artistUpdate).length > 0) {
        await updateArtistProfile(user.id, artistUpdate);
      }

      // Upload portfolio files
      for (const item of portfolioFiles) {
        try {
          await uploadArtistPortfolio(user.id, item.file, setUploadProgress);
        } catch {
          // Non-blocking: continue with other files
        }
      }

      await refreshUser();
      router.push("/dashboard");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

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
                  <label className="relative cursor-pointer group">
                    <div className="w-24 h-24 rounded-full bg-surface-input border-2 border-dashed border-white/10 flex flex-col items-center justify-center group-hover:border-primary/30 transition overflow-hidden">
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <span className="material-icons text-2xl text-slate-600">add_a_photo</span>
                          <span className="text-[10px] text-slate-600 mt-1">Upload</span>
                        </>
                      )}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Artist / Stage Name</label>
                  <input
                    type="text"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                    placeholder="e.g. DJ Nova, The Frequency"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
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
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handlePortfolioDrop}
                  onClick={() => portfolioInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                    isDragging ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30"
                  }`}
                >
                  <span className="material-icons text-5xl text-slate-600 mb-3">cloud_upload</span>
                  <p className="text-white font-medium mb-1">Drag and drop your files</p>
                  <p className="text-sm text-slate-500 mb-4">MP3, WAV, MP4, JPG, PNG up to 50MB each</p>
                  <span className="px-5 py-2 rounded-lg border border-white/10 text-sm text-slate-300">
                    Browse Files
                  </span>
                  <input
                    ref={portfolioInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/wav,video/mp4"
                    onChange={handlePortfolioSelect}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {portfolioFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">{portfolioFiles.length} file(s) selected</p>
                    {portfolioFiles.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-surface-input/50 rounded-lg px-3 py-2 border border-white/5">
                        <span className="text-sm text-slate-300 truncate">{item.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removePortfolioFile(i); }}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          <span className="material-icons text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Portfolio Link */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Or link your portfolio
                  </label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
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
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
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
                        onClick={() => toggleAvailability(option)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedAvailability.includes(option)
                            ? "bg-primary/20 border-primary/40 text-white"
                            : "bg-surface-input border-white/10 text-slate-400 hover:text-white hover:border-primary/30"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress & Error */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-1">Uploading... {Math.round(uploadProgress)}%</p>
                  </div>
                )}
                {error && <p className="text-sm text-red-400">{error}</p>}
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
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Finish"}
                  <span className="material-icons text-sm">check</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ArtistOnboardingPage() {
  return (
    <ProtectedRoute>
      <ArtistOnboardingContent />
    </ProtectedRoute>
  );
}
