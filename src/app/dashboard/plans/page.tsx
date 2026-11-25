"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import DesgloseCard from "@/components/contratacion/DesgloseCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTalentByUserId } from "@/hooks/useFirestore";
import { updateTalentListing, updateTalentPlans } from "@/lib/firestore";
import { ACTIVE_CITIES, ACTIVE_PROVIDER_CATEGORIES, inLaunchScope } from "@/lib/constants";
import { dollars } from "@/lib/contratacion";
import type { ServicePlan } from "@/types";

const MAX_PLANS = 6;
const empty = { title: "", description: "", price: "", includes: "" };

function PlansContent() {
  const { user } = useAuth();
  const { talent, loading } = useTalentByUserId(user?.id);
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [listingSaved, setListingSaved] = useState(false);

  useEffect(() => {
    if (!talent) return;
    setPlans(talent.servicePlans ?? []);
    setCategory(talent.category ?? "");
    setCity(talent.city ?? "");
  }, [talent]);

  async function saveListing() {
    if (!user || !category || !city) return;
    setBusy(true);
    setError("");
    try {
      await updateTalentListing(user.id, { category, city });
      setListingSaved(true);
    } catch {
      setError("Your listing could not be saved. Try again.");
    } finally {
      setBusy(false);
    }
  }

  // Why a profile is or is not in the marketplace, in the order it gets fixed.
  const listed = !!talent?.isApproved && inLaunchScope({ category, city }) && plans.length > 0;
  const missing = !talent
    ? ""
    : !inLaunchScope({ category, city })
    ? "Choose your category and city below."
    : plans.length === 0
    ? "Add at least one plan."
    : !talent.isApproved
    ? "Your account is waiting for approval."
    : "";
  const categoryOptions = Array.from(new Set([...ACTIVE_PROVIDER_CATEGORIES, ...(category ? [category] : [])]));
  const cityOptions = Array.from(new Set([...ACTIVE_CITIES, ...(city ? [city] : [])]));

  const price = Number(form.price);
  const priceOk = Number.isInteger(price) && price >= 1 && price <= 100000;

  async function persist(next: ServicePlan[]) {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      await updateTalentPlans(user.id, next);
      setPlans(next);
      setForm(empty);
      setEditingId(null);
    } catch {
      setError("Your plans could not be saved. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!form.title.trim()) return setError("Give the plan a name.");
    if (!priceOk) return setError("The price must be a whole number of dollars.");
    const plan: ServicePlan = {
      id: editingId ?? `p${Date.now().toString(36)}`,
      title: form.title.trim().slice(0, 60),
      description: form.description.trim().slice(0, 300),
      price,
      includes: form.includes
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 8),
    };
    persist(editingId ? plans.map((p) => (p.id === editingId ? plan : p)) : [...plans, plan]);
  }

  function edit(p: ServicePlan) {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, price: String(p.price), includes: p.includes.join("\n") });
    setError("");
  }

  const field =
    "w-full rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <span className="material-icons text-sm" aria-hidden="true">chevron_right</span>
            <span className="text-slate-300">My listing &amp; plans</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">My listing &amp; plans</h1>
          <p className="text-slate-500 mt-1 mb-8">
            What clients can book from your profile. A client requests a plan; you accept the price or counter it.
          </p>

          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-4xl text-primary animate-spin" aria-hidden="true">refresh</span>
            </div>
          ) : !talent ? (
            <p className="text-slate-400">Plans are available for talent accounts.</p>
          ) : (
            <>
            <section aria-label="Your listing" className="rounded-2xl border border-white/10 bg-surface-dark/50 p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-white">Your listing</h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    listed ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                  }`}
                >
                  {listed ? "Visible in the marketplace" : "Not visible yet"}
                </span>
              </div>
              {missing && <p className="text-sm text-slate-400 mb-4">{missing}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label htmlFor="listing-category" className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <select id="listing-category" value={category} onChange={(e) => { setCategory(e.target.value); setListingSaved(false); }} className={field}>
                    <option value="" disabled>Select</option>
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="listing-city" className="block text-sm font-medium text-slate-400 mb-2">City</label>
                  <select id="listing-city" value={city} onChange={(e) => { setCity(e.target.value); setListingSaved(false); }} className={field}>
                    <option value="" disabled>Select</option>
                    {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button
                  onClick={saveListing}
                  disabled={busy || !category || !city || listingSaved}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition disabled:opacity-50"
                >
                  {listingSaved ? "Saved" : "Save"}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section aria-label="Your plans" className="space-y-3">
                {plans.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
                    <span className="material-icons text-3xl text-slate-700" aria-hidden="true">sell</span>
                    <p className="text-white font-semibold mt-2">No plans yet</p>
                    <p className="text-sm text-slate-500 mt-1 px-6">
                      Without a plan your profile has nothing to book. Add your first one.
                    </p>
                  </div>
                )}
                {plans.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-white/10 bg-surface-dark/50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-white font-semibold truncate">{p.title}</h2>
                        <p className="text-sm text-slate-400 mt-0.5">{p.description}</p>
                      </div>
                      <p className="text-xl font-bold text-primary tabular-nums shrink-0">{dollars(p.price * 100)}</p>
                    </div>
                    {p.includes.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {p.includes.map((item, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                            <span className="material-icons text-green-400 text-sm" aria-hidden="true">check</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-4 mt-4 text-xs">
                      <button onClick={() => edit(p)} disabled={busy} className="text-primary-light hover:text-white transition">Edit</button>
                      <button
                        onClick={() => persist(plans.filter((x) => x.id !== p.id))}
                        disabled={busy}
                        className="text-slate-500 hover:text-red-300 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              <section aria-label={editingId ? "Edit plan" : "New plan"} className="rounded-2xl border border-white/10 bg-surface-dark/50 p-6 space-y-4 h-fit">
                <h2 className="text-lg font-semibold text-white">{editingId ? "Edit plan" : "New plan"}</h2>
                {!editingId && plans.length >= MAX_PLANS ? (
                  <p className="text-sm text-slate-400">You have {MAX_PLANS} plans, the maximum. Remove one to add another.</p>
                ) : (
                  <>
                    <div>
                      <label htmlFor="plan-title" className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                      <input id="plan-title" value={form.title} maxLength={60} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="4-hour DJ set" className={field} />
                    </div>
                    <div>
                      <label htmlFor="plan-price" className="block text-sm font-medium text-slate-400 mb-2">Price (USD, whole dollars)</label>
                      <input id="plan-price" type="number" inputMode="numeric" step="1" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="300" className={field} />
                    </div>
                    <div>
                      <label htmlFor="plan-desc" className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                      <textarea id="plan-desc" rows={2} maxLength={300} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} />
                    </div>
                    <div>
                      <label htmlFor="plan-includes" className="block text-sm font-medium text-slate-400 mb-2">What it includes (one per line)</label>
                      <textarea id="plan-includes" rows={3} value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} placeholder={"4 hours of music\nOwn sound equipment"} className={field} />
                    </div>

                    {form.price !== "" && <DesgloseCard priceCents={priceOk ? price * 100 : NaN} label="At your listed price" perspective="dj" />}

                    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                    <div className="flex gap-3">
                      {editingId && (
                        <button onClick={() => { setEditingId(null); setForm(empty); setError(""); }} className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:text-white transition">
                          Cancel
                        </button>
                      )}
                      <button onClick={save} disabled={busy} className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition disabled:opacity-50">
                        {busy ? "Saving..." : editingId ? "Save changes" : "Add plan"}
                      </button>
                    </div>
                  </>
                )}
              </section>
            </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PlansPage() {
  return (
    <ProtectedRoute>
      <PlansContent />
    </ProtectedRoute>
  );
}
