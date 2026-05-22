"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, UserStatus, type User } from "@/types";

/**
 * An account can perform "trust actions" (create events, contact/hire talent,
 * withdraw funds) once it is approved. Admins and super-users are always
 * considered active.
 */
export function isAccountActive(user: User | null): boolean {
  if (!user) return false;
  return (
    user.isSuperUser === true ||
    user.role === UserRole.ADMIN ||
    user.status === UserStatus.ACTIVE
  );
}

/**
 * Wraps an action area. If the signed-in user's account is still pending
 * approval, the children are replaced with a friendly notice instead.
 */
export default function AccountGate({
  children,
  action = "use this feature",
}: {
  children: React.ReactNode;
  action?: string;
}) {
  const { user } = useAuth();

  if (isAccountActive(user)) return <>{children}</>;

  const rejected = user?.status === UserStatus.REJECTED;
  const suspended = user?.status === UserStatus.SUSPENDED;

  return (
    <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-10 text-center max-w-lg mx-auto">
      <div className="mb-5 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
          <span className="material-icons text-3xl text-amber-400">
            {rejected || suspended ? "block" : "hourglass_top"}
          </span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        {rejected
          ? "Account not approved"
          : suspended
          ? "Account suspended"
          : "Account pending approval"}
      </h2>
      <p className="text-slate-400 leading-relaxed">
        {rejected
          ? `Your account was not approved, so you can't ${action} yet. Contact support if you think this is a mistake.`
          : suspended
          ? `Your account is suspended, so you can't ${action} right now. Reach out to support for help.`
          : `Our team is reviewing your account. You'll be able to ${action} as soon as it's approved — feel free to keep exploring in the meantime.`}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
        >
          Back to dashboard
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
