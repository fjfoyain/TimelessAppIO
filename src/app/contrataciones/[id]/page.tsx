"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import ContratacionPanel from "@/components/contratacion/ContratacionPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useContratacion } from "@/hooks/useFirestore";

function Content() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { item, transiciones, movimientos, loading } = useContratacion(user ? id : undefined);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/dashboard/projects" className="hover:text-white transition">Bookings</Link>
            <span className="material-icons text-sm" aria-hidden="true">chevron_right</span>
            <span className="text-slate-300 truncate">{item?.plan.title ?? "Booking"}</span>
          </nav>

          {loading ? (
            <div className="py-24 text-center">
              <span className="material-icons text-4xl text-primary animate-spin" aria-hidden="true">refresh</span>
              <p className="text-sm text-slate-500 mt-3">Loading booking...</p>
            </div>
          ) : !item || !user ? (
            <div className="py-24 text-center">
              <span className="material-icons text-4xl text-slate-700" aria-hidden="true">search_off</span>
              <p className="text-white font-semibold mt-3">This booking is not available</p>
              <p className="text-sm text-slate-500 mt-1">It may not exist, or you are not part of it.</p>
              <Link href="/dashboard/projects" className="inline-block mt-4 text-sm text-primary hover:underline">
                Back to your bookings
              </Link>
            </div>
          ) : (
            <ContratacionPanel c={item} transiciones={transiciones} movimientos={movimientos} uid={user.id} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ContratacionPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
