"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrCreateContract,
  getContractById,
  getConversationById,
  getTalentWithUser,
  signContract,
} from "@/lib/firestore";
import type { Contract } from "@/types";

function SignatureBadge({ signedAt }: { signedAt?: string }) {
  if (signedAt) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-400 font-medium">
        <span className="material-icons text-sm">check_circle</span>
        Signed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
      <span className="material-icons text-sm">schedule</span>
      Pending
    </span>
  );
}

function ContractContent() {
  const { user } = useAuth();
  const params = useSearchParams();
  const convoParam = params.get("convo");
  const amountParam = params.get("amount");
  const talentParam = params.get("talent");
  const planParam = params.get("plan");

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      try {
        // Preferred flow: convo carries planContext + (possibly) agreed price.
        if (convoParam) {
          const convo = await getConversationById(convoParam);
          if (!convo || !convo.planContext) {
            if (active) setErr("Conversation or plan not found.");
            return;
          }

          // If a contract already exists for this conversation, just load it.
          if (convo.contractId) {
            const c = await getContractById(convo.contractId);
            if (active) setContract(c);
            return;
          }

          const pc = convo.planContext;
          const clientId =
            convo.participants.find((p) => p !== pc.talentId) || user.id;
          const clientName = convo.participantNames?.[clientId] || "Client";
          const talentName = convo.participantNames?.[pc.talentId] || "Talent";
          const agreed = convo.negotiation?.status === "agreed";
          const amount = amountParam
            ? parseFloat(amountParam)
            : agreed
            ? convo.negotiation!.currentOffer
            : pc.planPrice;

          const c = await getOrCreateContract({
            conversationId: convo.id,
            clientId,
            clientName,
            talentId: pc.talentId,
            talentName,
            planId: pc.planId,
            planTitle: pc.planTitle,
            amount,
          });
          if (active) setContract(c);
          return;
        }

        // Legacy direct path: ?talent=&plan=.
        if (talentParam && planParam) {
          const res = await getTalentWithUser(talentParam);
          const plan = res?.talent.servicePlans.find((p) => p.id === planParam);
          if (!res || !plan) {
            if (active) setErr("Plan not found.");
            return;
          }
          const c = await getOrCreateContract({
            conversationId: `direct-${talentParam}-${planParam}-${user.id}`,
            clientId: user.id,
            clientName: user.name,
            talentId: talentParam,
            talentName: res.user.name,
            planId: planParam,
            planTitle: plan.title,
            amount: amountParam ? parseFloat(amountParam) : plan.price,
          });
          if (active) setContract(c);
          return;
        }

        if (active) setErr("Missing contract parameters.");
      } catch (e) {
        if (active) {
          setErr(e instanceof Error ? e.message : "Failed to load contract.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user, convoParam, amountParam, talentParam, planParam]);

  async function handleSign() {
    if (!user || !contract) return;
    setSigning(true);
    try {
      const updated = await signContract(contract.id, user.id);
      setContract(updated);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to sign.");
    } finally {
      setSigning(false);
    }
  }

  if (loading) {
    return <div className="pt-40 text-center text-gray-500">Loading contract...</div>;
  }

  if (err || !contract) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-32 pb-24 text-center">
        <span className="material-icons text-5xl text-slate-700">description</span>
        <h1 className="text-xl font-bold text-white mt-4">
          {err || "Contract unavailable"}
        </h1>
        <Link
          href="/messages"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
        >
          Back to messages
        </Link>
      </div>
    );
  }

  const iAmClient = user?.id === contract.clientId;
  const iAmTalent = user?.id === contract.talentId;
  const mySignedAt = iAmClient
    ? contract.clientSignedAt
    : iAmTalent
    ? contract.talentSignedAt
    : undefined;
  const otherSignedAt = iAmClient
    ? contract.talentSignedAt
    : iAmTalent
    ? contract.clientSignedAt
    : undefined;
  const otherName = iAmClient ? contract.talentName : contract.clientName;
  const fullySigned = contract.status === "fully_signed";

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 pt-32 pb-24">
      <Link
        href="/messages"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-8"
      >
        <span className="material-icons text-base">arrow_back</span>
        Back to messages
      </Link>

      <div className="rounded-2xl border border-white/5 bg-surface-dark p-8 space-y-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-light mb-1">
            Service Agreement
          </p>
          <h1 className="text-2xl font-bold text-white">Contract &amp; Signatures</h1>
          <p className="mt-1 text-sm text-gray-400">
            Both parties must sign before this agreement is binding on the platform.
          </p>
        </div>

        {/* Parties */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Parties
          </h2>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div>
              <p className="text-xs text-gray-500">Client</p>
              <p className="text-sm font-medium text-white">{contract.clientName}</p>
              {contract.clientSignedAt && (
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Signed {new Date(contract.clientSignedAt).toLocaleString()}
                </p>
              )}
            </div>
            <SignatureBadge signedAt={contract.clientSignedAt} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div>
              <p className="text-xs text-gray-500">Talent</p>
              <p className="text-sm font-medium text-white">{contract.talentName}</p>
              {contract.talentSignedAt && (
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Signed {new Date(contract.talentSignedAt).toLocaleString()}
                </p>
              )}
            </div>
            <SignatureBadge signedAt={contract.talentSignedAt} />
          </div>
        </div>

        {/* Service */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Service
          </h2>
          <p className="text-sm font-semibold text-white">{contract.planTitle}</p>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Financial Summary
          </h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Agreed amount</span>
              <span className="text-white">${contract.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Escrow fee (5%)</span>
              <span className="text-white">${contract.escrowFee.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="flex justify-between text-base font-bold">
              <span className="text-white">Total</span>
              <span className="text-primary">${contract.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sign action */}
        {!iAmClient && !iAmTalent ? (
          <p className="text-xs text-amber-400">
            You aren&apos;t a party of this contract — only the client and the talent can sign.
          </p>
        ) : fullySigned ? (
          <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center">
            <span className="material-icons text-green-400 text-3xl">verified</span>
            <p className="text-sm font-semibold text-white mt-1">
              Contract fully signed
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Payment processing will be enabled once the platform&apos;s payments go live.
            </p>
          </div>
        ) : mySignedAt ? (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
            <p className="text-sm text-white">
              You signed on {new Date(mySignedAt).toLocaleString()}.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {otherSignedAt
                ? "Both parties have signed."
                : `Waiting for ${otherName} to sign.`}
            </p>
          </div>
        ) : (
          <button
            onClick={handleSign}
            disabled={signing}
            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold btn-glow hover:bg-primary-hover transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <span className="material-icons text-base">draw</span>
            {signing
              ? "Signing..."
              : `Sign as ${iAmClient ? "client" : "talent"}`}
          </button>
        )}

        <p className="text-xs text-gray-600 leading-relaxed text-center">
          <span className="material-icons text-base align-middle mr-1">lock</span>
          Funds will be held in escrow once the platform&apos;s payments are live.
        </p>
      </div>
    </div>
  );
}

export default function ContractPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-dark text-white">
        <AnimatedBackground />
        <Navbar />
        <Suspense fallback={<div className="pt-40 text-center text-gray-500">Loading…</div>}>
          <ContractContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
