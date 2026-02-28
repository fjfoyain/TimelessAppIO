"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const stats = [
  {
    label: "Total Users",
    value: "12,450",
    change: "+18%",
    changeType: "positive" as const,
    icon: "group",
  },
  {
    label: "Active Artists",
    value: "890",
    change: "+11%",
    changeType: "positive" as const,
    icon: "music_note",
  },
  {
    label: "Venues",
    value: "342",
    change: "",
    changeType: "neutral" as const,
    icon: "location_on",
  },
  {
    label: "Pending Reviews",
    value: "15",
    change: "Action Needed",
    changeType: "warning" as const,
    icon: "rate_review",
  },
];

const pendingApprovals = [
  { name: "Luna Vex", type: "Artist", avatar: "L" },
  { name: "The Velvet Room", type: "Venue", avatar: "V" },
  { name: "Marcus Cole", type: "Talent", avatar: "M" },
  { name: "Skyline Studios", type: "Venue", avatar: "S" },
];

const recentActivity = [
  {
    user: "Luna Vex",
    action: "Registered as Artist",
    category: "Registration",
    date: "2026-02-27",
    status: "Completed",
  },
  {
    user: "Marcus Cole",
    action: "Submitted profile for review",
    category: "Profile",
    date: "2026-02-27",
    status: "Pending",
  },
  {
    user: "Neon Lounge",
    action: "Updated venue capacity",
    category: "Venue",
    date: "2026-02-26",
    status: "Completed",
  },
  {
    user: "DJ Phantom",
    action: "Reported content violation",
    category: "Moderation",
    date: "2026-02-26",
    status: "Pending",
  },
  {
    user: "System",
    action: "Automated backup completed",
    category: "System",
    date: "2026-02-25",
    status: "Completed",
  },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-400 border-green-500/20",
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Error: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return map[status] || map["Pending"];
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-background-dark relative">
        <AnimatedBackground />
        <Navbar />

        <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              Admin Control Center
            </h1>
            <p className="text-gray-500">
              Platform overview and management tools
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-lg text-primary">
                      {stat.icon}
                    </span>
                  </div>
                  {stat.change && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.changeType === "positive"
                          ? "bg-green-500/10 text-green-400"
                          : stat.changeType === "warning"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Two-column grid: Growth + Approvals */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
            {/* Platform Growth */}
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Platform Growth
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Monthly user acquisition
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">2,340</p>
                  <span className="text-xs font-semibold text-green-400">
                    +11.1%
                  </span>
                </div>
              </div>
              {/* Chart placeholder */}
              <div className="h-48 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-icons text-3xl text-gray-700 mb-2 block">
                    show_chart
                  </span>
                  <p className="text-xs text-gray-600">
                    Chart visualization coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Pending Approvals
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires admin action
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {pendingApprovals.length} pending
                </span>
              </div>
              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-light">
                        {item.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent System Activity */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Recent System Activity
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Latest platform events
                </p>
              </div>
              <button className="text-xs text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                View all
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-medium">
                        {row.user}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{row.action}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{row.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${statusBadge(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AdminLayout>
  );
}
