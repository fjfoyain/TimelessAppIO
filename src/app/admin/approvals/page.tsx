"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { useApprovals } from "@/hooks/useFirestore";
import type { ApprovalType } from "@/types";

type FilterTab = "All" | "Venues" | "Talents" | "Events";

const filterTabs: FilterTab[] = ["All", "Venues", "Talents", "Events"];

function typeConfig(type: ApprovalType) {
  const map: Record<
    ApprovalType,
    { color: string; bg: string; border: string; icon: string }
  > = {
    Venue: {
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      icon: "location_on",
    },
    Talent: {
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
      border: "border-accent-cyan/20",
      icon: "star",
    },
    Event: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: "event",
    },
  };
  return map[type];
}

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const { approvals, loading, approve, reject } = useApprovals("pending");

  const filteredApprovals = approvals.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Venues") return item.type === "Venue";
    if (activeTab === "Talents") return item.type === "Talent";
    if (activeTab === "Events") return item.type === "Event";
    return true;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background-dark relative">
        <AnimatedBackground />
        <Navbar />

        <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">
              Pending Approvals
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {loading ? "..." : approvals.length}
            </span>
          </div>
          <p className="text-gray-500 mb-8">
            Review and approve submitted profiles, venues, and events
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-8">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-16 text-center">
              <span className="material-icons text-4xl text-primary animate-spin mb-3 block">hourglass_empty</span>
              <p className="text-sm text-gray-500">Loading approvals...</p>
            </div>
          ) : (
            <>
              {/* Approval Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredApprovals.map((item) => {
                  const config = typeConfig(item.type);
                  return (
                    <div
                      key={item.id}
                      className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 group"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center text-sm font-bold ${config.color}`}
                          >
                            {item.avatar}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm group-hover:text-primary-light transition-colors">
                              {item.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}
                            >
                              <span className="material-icons text-xs">
                                {config.icon}
                              </span>
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Submitted date */}
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-5">
                        <span className="material-icons text-xs">
                          schedule
                        </span>
                        Submitted: {item.submittedDate}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approve(item.id)}
                          className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span className="material-icons text-sm">
                            check_circle
                          </span>
                          Approve
                        </button>
                        <button
                          onClick={() => reject(item.id)}
                          className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span className="material-icons text-sm">cancel</span>
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredApprovals.length === 0 && (
                <div className="py-16 text-center">
                  <span className="material-icons text-4xl text-gray-700 mb-3 block">
                    check_circle
                  </span>
                  <p className="text-sm text-gray-500">
                    No pending approvals in this category
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </div>
    </AdminLayout>
  );
}
