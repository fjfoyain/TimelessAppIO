"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { useAnalyticsMetrics, useMonthlyRevenue, useTopCategories } from "@/hooks/useFirestore";

const monthLabels: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

export default function AnalyticsPage() {
  const { metrics, loading: metricsLoading } = useAnalyticsMetrics();
  const { data: monthlyData, loading: chartLoading } = useMonthlyRevenue();
  const { categories, loading: catLoading } = useTopCategories();

  const metricCards = [
    {
      label: "Revenue",
      value: metricsLoading ? "..." : formatCurrency(metrics.revenue),
      icon: "payments",
    },
    {
      label: "Users",
      value: metricsLoading ? "..." : metrics.newUsers.toLocaleString(),
      icon: "person_add",
    },
    {
      label: "Events",
      value: metricsLoading ? "..." : metrics.totalEvents.toLocaleString(),
      icon: "event",
    },
    {
      label: "Bookings",
      value: metricsLoading ? "..." : metrics.totalBookings.toLocaleString(),
      icon: "calendar_month",
    },
  ];

  const maxRevenue = monthlyData.length > 0
    ? Math.max(...monthlyData.map((d) => d.amount))
    : 1;

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
            {metricCards.map((metric) => (
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
                </div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Revenue Overview
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Monthly revenue from completed deposits
                </p>
              </div>
            </div>

            {chartLoading ? (
              <div className="h-64 flex items-center justify-center">
                <span className="material-icons text-4xl text-primary animate-pulse">bar_chart</span>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-64 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-icons text-4xl text-gray-700 mb-2 block">bar_chart</span>
                  <p className="text-sm text-gray-600">No revenue data yet</p>
                  <p className="text-xs text-gray-700 mt-1">
                    Revenue will appear here as transactions are processed
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-end gap-3 px-4">
                {monthlyData.map((item) => {
                  const heightPct = maxRevenue > 0 ? (item.amount / maxRevenue) * 100 : 0;
                  const monthNum = item.month.split("-")[1];
                  const label = monthLabels[monthNum] || monthNum;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {formatCurrency(item.amount)}
                      </span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light min-h-[4px] transition-all duration-500"
                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                      />
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Categories Table */}
          <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Top Categories
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Service categories by revenue
                </p>
              </div>
            </div>

            {catLoading ? (
              <div className="flex items-center justify-center py-10">
                <span className="material-icons text-3xl text-primary animate-pulse">category</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10">
                <span className="material-icons text-4xl text-gray-700 mb-2 block">category</span>
                <p className="text-sm text-gray-600">No category data yet</p>
                <p className="text-xs text-gray-700 mt-1">
                  Categories will appear as services and bookings are created
                </p>
              </div>
            ) : (
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
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, i) => (
                      <tr
                        key={cat.name}
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
                          {formatCurrency(cat.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AdminLayout>
  );
}
