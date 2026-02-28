"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useFirestore";
import type { Event as AppEvent } from "@/types";

interface ColumnDef {
  title: string;
  status: string;
  color: string;
  borderColor: string;
  icon: string;
  items: AppEvent[];
}

const typeStyles: Record<string, string> = {
  Event: "text-primary-light bg-primary/10",
  Performance: "text-pink-400 bg-pink-400/10",
  Production: "text-amber-400 bg-amber-400/10",
  Creative: "text-cyan-400 bg-cyan-400/10",
  Design: "text-fuchsia-400 bg-fuchsia-400/10",
  Studio: "text-green-400 bg-green-400/10",
};

function ProjectsContent() {
  const { user } = useAuth();
  const { events, loading } = useEvents(user?.id);

  // Map events to kanban columns based on event status
  const columns: ColumnDef[] = [
    {
      title: "Inquiries",
      status: "New",
      color: "text-cyan-400",
      borderColor: "border-cyan-400/30",
      icon: "inbox",
      items: events.filter((e) => e.status === "draft"),
    },
    {
      title: "In Progress",
      status: "Active",
      color: "text-primary-light",
      borderColor: "border-primary/30",
      icon: "pending_actions",
      items: events.filter((e) => e.status === "published"),
    },
    {
      title: "Completed",
      status: "Done",
      color: "text-green-400",
      borderColor: "border-green-400/30",
      icon: "task_alt",
      items: events.filter((e) => e.status === "completed"),
    },
  ];

  const totalProjects = columns.reduce((sum, col) => sum + col.items.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 pt-24 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <span className="material-icons text-4xl text-primary animate-spin mb-3 block">hourglass_empty</span>
                <p className="text-sm text-slate-500">Loading projects...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Project Manager</h1>
              <p className="text-slate-500 mt-1">
                Track inquiries, active projects, and completed work in one place.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-icons text-sm text-primary">folder</span>
                <span className="font-medium text-white">{totalProjects}</span> projects
              </div>
            </div>
          </div>

          {/* Empty State */}
          {events.length === 0 ? (
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
              <span className="material-icons text-5xl text-slate-700 mb-3 block">folder_off</span>
              <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-sm text-slate-500 mb-6">Create an event to start tracking projects.</p>
            </div>
          ) : (
            <>
              {/* Kanban Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {columns.map((column) => (
                  <div key={column.title} className="space-y-4">
                    {/* Column Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`material-icons text-lg ${column.color}`}>{column.icon}</span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{column.title}</h2>
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${column.color} bg-white/5`}>
                          {column.items.length}
                        </span>
                      </div>
                    </div>

                    {/* Column Body */}
                    <div className={`space-y-3 p-4 rounded-2xl bg-surface-dark/30 border ${column.borderColor} min-h-[200px]`}>
                      {column.items.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-xs text-slate-600">No items</p>
                        </div>
                      ) : (
                        column.items.map((event) => (
                          <div
                            key={event.id}
                            className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-4 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                          >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-sm font-semibold text-white group-hover:text-primary-light transition-colors leading-tight">
                                {event.title}
                              </h3>
                              <button className="p-1 rounded-lg hover:bg-white/5 transition opacity-0 group-hover:opacity-100">
                                <span className="material-icons text-sm text-slate-500">more_horiz</span>
                              </button>
                            </div>

                            {/* Organizer */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-icons text-primary text-xs">person</span>
                              </div>
                              <span className="text-xs text-slate-400">{event.organizer}</span>
                            </div>

                            {/* Meta Row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${typeStyles["Event"]}`}>
                                  Event
                                </span>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                              <span className="material-icons text-xs text-slate-600">schedule</span>
                              <span className="text-[11px] text-slate-500">{event.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Banner */}
              <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-primary text-xl">insights</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pipeline Overview</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      You have {columns[0].items.length} new inquiries and {columns[1].items.length} active projects.
                      Stay on top of deadlines to keep your reputation strong.
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow">
                  <span className="material-icons text-sm">add</span>
                  New Project
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProjectsDashboardPage() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  );
}
