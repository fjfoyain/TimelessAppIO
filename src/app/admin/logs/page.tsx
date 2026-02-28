"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { useAuditLogs } from "@/hooks/useFirestore";
import type { LogLevel } from "@/types";

function levelBadge(level: LogLevel) {
  const map: Record<LogLevel, string> = {
    Info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Error: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return map[level];
}

function levelIcon(level: LogLevel) {
  const map: Record<LogLevel, string> = {
    Info: "info",
    Warning: "warning",
    Error: "error",
  };
  return map[level];
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"All" | LogLevel>("All");
  const [dateFilter, setDateFilter] = useState("all");
  const { logs, loading } = useAuditLogs(100);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      levelFilter === "All" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background-dark relative">
        <AnimatedBackground />
        <Navbar />

        <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              Audit & System Logs
            </h1>
            <p className="text-gray-500">
              Monitor all platform activity and system events
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search logs by action or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) =>
                setLevelFilter(e.target.value as "All" | LogLevel)
              }
              className="px-4 py-2.5 rounded-xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 text-sm text-gray-300 focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All">All Levels</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 text-sm text-gray-300 focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-16 text-center">
              <span className="material-icons text-4xl text-primary animate-spin mb-3 block">hourglass_empty</span>
              <p className="text-sm text-gray-500">Loading logs...</p>
            </div>
          ) : (
            /* Logs Table */
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3.5 px-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">
                          {log.userName}
                        </td>
                        <td className="py-3.5 px-4 text-white">
                          {log.action}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                          {log.ipAddress}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${levelBadge(
                              log.level
                            )}`}
                          >
                            <span className="material-icons text-xs">
                              {levelIcon(log.level)}
                            </span>
                            {log.level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="py-12 text-center">
                  <span className="material-icons text-3xl text-gray-700 mb-2 block">
                    search_off
                  </span>
                  <p className="text-sm text-gray-600">
                    No logs match your filters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </AdminLayout>
  );
}
