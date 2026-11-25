"use client";

import { useState } from "react";
import DesgloseCard from "./DesgloseCard";
import {
  DEFAULT_PLACE,
  EVENT_KINDS,
  EVENT_PLACES,
  zonedToUtc,
  SIZE_KIND_LABELS,
  SIZE_RANGES,
  dollars,
  ofertaError,
  offerBounds,
  type SizeKind,
} from "@/lib/contratacion";
import type { ServicePlan } from "@/types";

export interface SolicitudInput {
  eventAt: Date;
  eventType: string;
  sizeKind: SizeKind;
  sizeRange: string;
  place: string;
  offerCents: number;
}

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <fieldset aria-label={label || "Size range"}>
      {label && <legend className="block text-sm font-medium text-slate-400 mb-2">{label}</legend>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              value === o.value
                ? "border-primary/50 bg-primary/15 text-white"
                : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// The booking request: date, kind of event and its size are a few taps, not a
// form. The price breakdown is visible before sending.
export default function SolicitudModal({
  plan,
  talentName,
  onClose,
  onSubmit,
}: {
  plan: ServicePlan;
  talentName: string;
  onClose: () => void;
  onSubmit: (input: SolicitudInput) => Promise<void>;
}) {
  const listCents = plan.price * 100;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [eventType, setEventType] = useState("");
  const [sizeKind, setSizeKind] = useState<SizeKind>("personas");
  const [sizeRange, setSizeRange] = useState("");
  const [offer, setOffer] = useState(String(plan.price));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const offerCents = Math.round(parseFloat(offer) * 100);
  const offerProblem = offer === "" ? "Enter your offer." : ofertaError(offerCents, listCents);
  const { minCents, maxCents } = offerBounds(listCents);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  async function handleSubmit() {
    // The time is the time where the event happens, not on this device.
    const tz = EVENT_PLACES.find((p) => p.value === place)?.tz ?? "";
    const eventAt = new Date(zonedToUtc(date, time || "20:00", tz));
    if (!date || Number.isNaN(eventAt.getTime())) return setError("Choose the date of the event.");
    if (eventAt.getTime() <= Date.now()) return setError("The event must be in the future.");
    if (!eventType) return setError("Choose the type of event.");
    if (!sizeRange) return setError("Choose the size of the event.");
    if (offerProblem) return setError(offerProblem);
    setSaving(true);
    setError("");
    try {
      await onSubmit({ eventAt, eventType, sizeKind, sizeRange, place, offerCents });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request could not be sent.");
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition [color-scheme:dark]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="solicitud-title"
        className="bg-surface-dark border border-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 id="solicitud-title" className="text-xl font-bold text-white">Request this plan</h3>
            <p className="text-sm text-slate-400 mt-1">
              {plan.title} · {talentName} · listed at {dollars(listCents)}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition" aria-label="Close">
            <span className="material-icons" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sol-date" className="block text-sm font-medium text-slate-400 mb-2">Event date</label>
              <input id="sol-date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor="sol-time" className="block text-sm font-medium text-slate-400 mb-2">Start time</label>
              <input id="sol-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} />
            </div>
          </div>

          <div>
            <label htmlFor="sol-place" className="block text-sm font-medium text-slate-400 mb-2">Where is the event?</label>
            <select id="sol-place" value={place} onChange={(e) => setPlace(e.target.value)} className={input}>
              {EVENT_PLACES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5">The date and time above are local time there.</p>
          </div>

          <Chips label="Type of event" options={EVENT_KINDS} value={eventType} onChange={setEventType} />

          <div className="space-y-2">
            <Chips
              label="Size, measured in"
              options={(Object.keys(SIZE_RANGES) as SizeKind[]).map((k) => ({ value: k, label: SIZE_KIND_LABELS[k] }))}
              value={sizeKind}
              onChange={(k) => {
                setSizeKind(k);
                setSizeRange("");
              }}
            />
            <Chips label="" options={SIZE_RANGES[sizeKind]} value={sizeRange} onChange={setSizeRange} />
          </div>

          <div>
            <label htmlFor="sol-offer" className="block text-sm font-medium text-slate-400 mb-2">Your offer (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
              <input
                id="sol-offer"
                type="number"
                inputMode="numeric"
                step="1"
                min={minCents / 100}
                max={maxCents / 100}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className={`${input} pl-8`}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Between {dollars(minCents)} and {dollars(maxCents)}, in whole dollars. The DJ can accept or counter.
            </p>
          </div>

          <DesgloseCard priceCents={offerProblem ? NaN : offerCents} label="Your offer" perspective="cliente" />

          <p className="text-[11px] text-slate-500">
            Nothing is charged now. The booking is confirmed when the deposit is verified.
          </p>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition disabled:opacity-50"
            >
              {saving ? "Sending..." : "Send request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
