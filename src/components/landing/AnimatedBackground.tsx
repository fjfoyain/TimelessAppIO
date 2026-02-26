export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Purple glow orb - top right */}
      <div
        className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px] animate-pulse-slow"
        aria-hidden="true"
      />

      {/* Blue glow orb - bottom left */}
      <div
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] animate-float-delayed"
        aria-hidden="true"
      />

      {/* Cyan accent orb - center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent-cyan/5 blur-[100px] animate-float-slow"
        aria-hidden="true"
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
