"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ProjectCard {
  id: string;
  name: string;
  client: string;
  budget: string;
  deadline: string;
  type: string;
}

const columns: { title: string; status: string; color: string; borderColor: string; icon: string; items: ProjectCard[] }[] = [
  {
    title: "Inquiries",
    status: "New",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    icon: "inbox",
    items: [
      { id: "i1", name: "Corporate Gala Entertainment", client: "Acme Corp", budget: "$8,000", deadline: "Apr 5, 2026", type: "Event" },
      { id: "i2", name: "Wedding Reception Band", client: "Sarah & James", budget: "$3,500", deadline: "May 20, 2026", type: "Performance" },
    ],
  },
  {
    title: "In Progress",
    status: "Active",
    color: "text-primary-light",
    borderColor: "border-primary/30",
    icon: "pending_actions",
    items: [
      { id: "p1", name: "Brand Launch Party", client: "Nova Studios", budget: "$12,000", deadline: "Mar 15, 2026", type: "Production" },
      { id: "p2", name: "Music Video Shoot", client: "Luna Ray", budget: "$5,500", deadline: "Mar 22, 2026", type: "Creative" },
      { id: "p3", name: "Festival Stage Design", client: "Horizon Events", budget: "$18,000", deadline: "Apr 1, 2026", type: "Design" },
    ],
  },
  {
    title: "Completed",
    status: "Done",
    color: "text-green-400",
    borderColor: "border-green-400/30",
    icon: "task_alt",
    items: [
      { id: "c1", name: "Album Release Party", client: "Echo Chamber", budget: "$6,200", deadline: "Feb 28, 2026", type: "Event" },
      { id: "c2", name: "Studio Session Package", client: "DJ Neon Pulse", budget: "$2,800", deadline: "Feb 15, 2026", type: "Studio" },
    ],
  },
];

const typeStyles: Record<string, string> = {
  Event: "text-primary-light bg-primary/10",
  Performance: "text-pink-400 bg-pink-400/10",
  Production: "text-amber-400 bg-amber-400/10",
  Creative: "text-cyan-400 bg-cyan-400/10",
  Design: "text-fuchsia-400 bg-fuchsia-400/10",
  Studio: "text-green-400 bg-green-400/10",
};

function ProjectsContent() {
  const totalProjects = columns.reduce((sum, col) => sum + col.items.length, 0);
  const totalBudget = columns
    .flatMap((col) => col.items)
    .reduce((sum, item) => sum + parseFloat(item.budget.replace(/[$,]/g, "")), 0);

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
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-icons text-sm text-green-400">payments</span>
                <span className="font-medium text-white">${totalBudget.toLocaleString()}</span> total value
              </div>
            </div>
          </div>

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
                  {column.items.map((project) => (
                    <div
                      key={project.id}
                      className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-4 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white group-hover:text-primary-light transition-colors leading-tight">
                          {project.name}
                        </h3>
                        <button className="p-1 rounded-lg hover:bg-white/5 transition opacity-0 group-hover:opacity-100">
                          <span className="material-icons text-sm text-slate-500">more_horiz</span>
                        </button>
                      </div>

                      {/* Client */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary text-xs">person</span>
                        </div>
                        <span className="text-xs text-slate-400">{project.client}</span>
                      </div>

                      {/* Meta Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white">{project.budget}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${typeStyles[project.type] || "text-slate-400 bg-slate-400/10"}`}>
                            {project.type}
                          </span>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                        <span className="material-icons text-xs text-slate-600">schedule</span>
                        <span className="text-[11px] text-slate-500">{project.deadline}</span>
                      </div>
                    </div>
                  ))}
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
