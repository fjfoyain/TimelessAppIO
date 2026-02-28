"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

const metrics = [
  {
    label: "Revenue",
    value: "$128K",
    change: "+23%",
    changeType: "positive" as const,
    icon: "payments",
  },
  {
    label: "New Users",
    value: "2,340",
    change: "+11%",
    changeType: "positive" as const,
    icon: "person_add",
  },
  {
    label: "Events",
    value: "89",
    change: "+5%",
    changeType: "positive" as const,
    icon: "event",
  },
  {
    label: "Conversion",
    value: "4.2%",
    change: "+0.3%",
    changeType: "positive" as const,
    icon: "trending_up",
  },
];

const topCategories = [
  { name: "Music Production", bookings: 342, revenue: "$45,200", growth: "+18%" },
  { name: "DJs & Live Acts", bookings: 289, revenue: "$38,700", growth: "+12%" },
  { name: "Venue Hosting", bookings: 198, revenue: "$28,100", growth: "+9%" },
  { name: "Sound Engineering", bookings: 156, revenue: "$21,500", growth: "+15%" },
  { name: "Event Planning", bookings: 134, revenue: "$18,900", growth: "+7%" },
  { name: "Photography", bookings: 112, revenue: "$14,300", growth: "+22%" },
];

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-background-dark relative">
        <AnimatedBackground />
        <Navbar />

        <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              Analytics Dashboard
            </h1>
            <p className="text-gray-500">
              Platform performance metrics and insights
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-lg text-primary">
                      {metric.icon}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                    {metric.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Revenue Overview
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Monthly revenue breakdown
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20">
                  Monthly
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                  Weekly
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                  Daily
                </button>
              </div>
            </div>

            {/* Chart area */}
            <div className="h-64 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons text-4xl text-gray-700 mb-2 block">
                  bar_chart
                </span>
                <p className="text-sm text-gray-600">
                  Revenue chart visualization
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  Connect analytics provider to populate
                </p>
              </div>
            </div>
          </div>

          {/* Top Categories Table */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Top Categories
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Best performing service categories
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCategories.map((cat, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {i + 1}
                            </span>
                          </div>
                          <span className="text-white font-medium">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {cat.bookings}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {cat.revenue}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                          {cat.growth}
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
