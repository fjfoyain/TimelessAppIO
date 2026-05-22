"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useTalentByUserId } from "@/hooks/useFirestore";
import { updateTalentPortfolio } from "@/lib/firestore";
import { uploadPortfolioImage } from "@/lib/storage";
import type { PortfolioItem } from "@/types";

function PortfolioContent() {
  const { user } = useAuth();
  const { talent, loading } = useTalentByUserId(user?.id);

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (talent) setItems(talent.portfolio || []);
  }, [talent]);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: "Image must be under 5MB." });
      return;
    }
    setFile(f);
    setFileName(f.name);
    setMsg(null);
  }

  async function persist(next: PortfolioItem[]) {
    if (!user) return;
    await updateTalentPortfolio(user.id, next);
    setItems(next);
  }

  async function handleAdd() {
    if (!user || !file) return;
    setBusy(true);
    setMsg(null);
    try {
      const url = await uploadPortfolioImage(user.id, file, setProgress);
      const next: PortfolioItem[] = [
        ...items,
        { type: "image", url, caption: caption.trim() || undefined },
      ];
      await persist(next);
      setFile(null);
      setFileName("");
      setCaption("");
      setMsg({ type: "success", text: "Added to your portfolio." });
    } catch (err) {
      setMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  async function handleRemove(index: number) {
    setBusy(true);
    try {
      await persist(items.filter((_, i) => i !== index));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Portfolio</h1>
            <p className="text-slate-500 mt-1">
              Showcase your best work — these images appear on your public profile.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-3xl text-primary animate-spin">refresh</span>
            </div>
          ) : !talent ? (
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 text-center">
              <span className="material-icons text-4xl text-slate-700 mb-2 block">collections</span>
              <p className="text-slate-400">
                A portfolio is available for talent accounts. Once your talent
                profile exists you can add work samples here.
              </p>
              <Link
                href="/dashboard"
                className="inline-block mt-4 px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
              >
                Back to dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Uploader */}
              <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Add a work sample</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-input border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition cursor-pointer">
                    <span className="material-icons text-lg">add_photo_alternate</span>
                    <span className="truncate">
                      {fileName || "Choose an image — JPG, PNG or WebP, up to 5MB"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={pickFile}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Caption (optional)"
                    className="w-full rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {progress > 0 && progress < 100 && (
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={handleAdd}
                    disabled={!file || busy}
                    className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {busy ? "Working..." : "Add to portfolio"}
                  </button>
                  {msg && (
                    <p
                      className={`text-xs ${
                        msg.type === "success" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Current items */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4">
                  Your portfolio ({items.length})
                </h2>
                {items.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No work samples yet. Add your first image above.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl overflow-hidden border border-white/10 group"
                      >
                        <div className="relative h-40">
                          <Image
                            src={item.url}
                            alt={item.caption || "Portfolio item"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {item.caption && (
                          <p className="absolute bottom-0 left-0 right-0 text-xs text-white/90 bg-black/60 px-2 py-1 truncate">
                            {item.caption}
                          </p>
                        )}
                        <button
                          onClick={() => handleRemove(i)}
                          disabled={busy}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-red-500/80 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          aria-label="Remove image"
                        >
                          <span className="material-icons text-white text-sm">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioContent />
    </ProtectedRoute>
  );
}
