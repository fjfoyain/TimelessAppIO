"use client";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0a060f] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7f13ec]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center">
            <span className="material-icons text-5xl text-amber-400">construction</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          We&apos;ll Be Right Back
        </h1>
        <p className="text-lg text-slate-400 mb-6 leading-relaxed">
          Scheduled maintenance is currently in progress. We are upgrading our
          systems to bring you a better experience.
        </p>

        {/* Estimated Time */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#13111a]/80 border border-white/5 mb-8">
          <span className="material-icons text-amber-400">schedule</span>
          <div className="text-left">
            <p className="text-xs text-slate-500">Estimated Return</p>
            <p className="text-sm font-semibold text-white">Today at 6:00 PM EST</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-xs mx-auto mb-8">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#7f13ec] to-[#9d4dff] animate-pulse" />
          </div>
          <p className="text-xs text-slate-600 mt-2">Maintenance in progress...</p>
        </div>

        {/* Status Link */}
        <div className="space-y-4">
          <a
            href="https://status.timeless.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition"
          >
            <span className="material-icons text-sm">open_in_new</span>
            Check System Status
          </a>
        </div>

        {/* Branding */}
        <div className="mt-16 flex items-center justify-center gap-2 opacity-40">
          <span className="material-icons text-[#7f13ec] text-xl">hourglass_empty</span>
          <span className="text-sm font-bold tracking-tighter text-white">TIMELESS</span>
        </div>
      </div>
    </div>
  );
}
