import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/5 bg-surface-dark/50 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="material-icons text-primary text-2xl">hourglass_empty</span>
          <h2 className="text-xl font-bold tracking-tight">TIMELESS</h2>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/marketplace" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Marketplace
            </Link>
            <Link href="/studio" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Studio
            </Link>
          </nav>
          <div className="flex gap-3 pl-4 border-l border-white/10">
            <Link
              href="/login"
              className="flex h-9 px-5 items-center justify-center rounded-full border border-white/10 bg-transparent hover:bg-white/5 text-white text-sm font-semibold transition-all"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="flex h-9 px-5 items-center justify-center rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-glow transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-4 py-12 md:py-20">
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-white/5 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10">
          {/* 404 Visual */}
          <div className="flex flex-col items-center text-center gap-2">
            <h1
              className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-white select-none"
              style={{
                textShadow:
                  "0 0 10px rgba(157, 77, 255, 0.3), 0 0 20px rgba(157, 77, 255, 0.3), 0 0 40px rgba(127, 19, 236, 0.2)",
              }}
            >
              404
            </h1>
            <div className="h-1 w-24 bg-primary/50 rounded-full blur-[2px]" />
          </div>

          {/* Image Container */}
          <div className="w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group bg-surface-dark">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10 opacity-80" />
            {/* Spotlight effect */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 mix-blend-overlay" />
            {/* Spotlight visual */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent z-5" />

            {/* Floating Text Over Image */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-30 flex flex-col items-center text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                Lost in the Sound?
              </h3>
              <p className="text-slate-400 text-sm md:text-base max-w-md">
                Looks like you took a wrong turn. This stage doesn&apos;t exist yet, or maybe the
                show hasn&apos;t started.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mt-4">
            <Link
              href="/"
              className="group relative flex h-12 w-full sm:w-auto min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-white transition-all hover:bg-primary-dark hover:shadow-glow"
            >
              <span className="relative flex items-center gap-2 font-bold tracking-wide text-sm">
                <span className="material-icons text-lg">arrow_back</span>
                Back to Main Stage
              </span>
            </Link>
            <Link
              href="/contact"
              className="flex h-12 w-full sm:w-auto min-w-[200px] cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-surface-dark px-6 text-slate-300 transition-colors hover:bg-white/5 hover:text-white hover:border-white/20 font-semibold text-sm tracking-wide"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background-dark py-8 px-6 mt-auto relative z-10">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/50">
            <span className="material-icons text-2xl">hourglass_empty</span>
            <span className="font-bold text-lg tracking-tight">Timeless</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Link href="/privacy" className="text-slate-500 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-slate-500 hover:text-primary transition-colors text-sm">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
