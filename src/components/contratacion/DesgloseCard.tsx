import { COMMISSION_PCT, DEPOSIT_PCT, desglose, dollars } from "@/lib/contratacion";

// Where every dollar of a price goes, and how it is paid. Shown to both sides
// before anyone accepts: the same figures the security rules will enforce.
export default function DesgloseCard({
  priceCents,
  label = "Service price",
  perspective,
}: {
  priceCents: number;
  label?: string;
  // Highlights the row that matters to the person looking at it.
  perspective?: "cliente" | "dj";
}) {
  const valid = Number.isInteger(priceCents) && priceCents > 0 && priceCents % 100 === 0;
  if (!valid) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-slate-500">
        Enter a whole-dollar price to see the breakdown.
      </div>
    );
  }
  const d = desglose(priceCents);

  const row = (name: string, cents: number, hint: string, strong = false) => (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <div className="min-w-0">
        <p className={`text-sm ${strong ? "text-white font-semibold" : "text-slate-300"}`}>{name}</p>
        <p className="text-[11px] text-slate-500">{hint}</p>
      </div>
      <p className={`text-sm tabular-nums shrink-0 ${strong ? "text-white font-semibold" : "text-slate-300"}`}>
        {dollars(cents)}
      </p>
    </div>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Where it goes</p>
        {row(label, priceCents, "What the client pays in total", true)}
        {row(`Timeless commission (${COMMISSION_PCT}%)`, d.commissionCents, "Kept by Timeless")}
        {row("DJ receives", d.talentNetCents, "Held part plus the rest", perspective === "dj")}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">How it is paid</p>
        {row(
          `Deposit (${DEPOSIT_PCT}%)`,
          d.depositCents,
          `Through Timeless: ${dollars(d.commissionCents)} commission + ${dollars(d.heldCents)} held for the DJ until the event happens`,
          perspective === "cliente"
        )}
        {row("Rest", d.directCents, "Paid by the client directly to the DJ")}
      </div>
    </div>
  );
}
