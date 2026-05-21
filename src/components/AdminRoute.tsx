"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types";

/**
 * Guards admin-only pages. Requires an authenticated user whose profile has
 * the ADMIN role (or the isSuperUser flag). Non-admins are redirected away;
 * unauthenticated visitors are sent to login.
 */
export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser, user, loading } = useAuth();
  const router = useRouter();

  const isAdmin =
    !!user && (user.role === UserRole.ADMIN || user.isSuperUser === true);

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/dashboard");
    }
  }, [firebaseUser, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-deep flex items-center justify-center">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    );
  }

  if (!firebaseUser || !isAdmin) return null;

  return <>{children}</>;
}
