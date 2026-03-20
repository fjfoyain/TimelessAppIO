export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#050408] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <span className="material-icons text-3xl text-primary">wifi_off</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">You&apos;re offline</h1>
      <p className="text-slate-500 max-w-xs">
        It looks like you&apos;ve lost your connection. Check your network and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm hover:shadow-glow transition-all duration-300"
      >
        Try again
      </button>
    </div>
  );
}
