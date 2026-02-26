"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-deep flex items-center justify-center">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    );
  }

  if (!firebaseUser) return null;

  return <>{children}</>;
}
