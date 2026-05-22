"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useFirestore";
import type { Project, ProjectStatus } from "@/types";

const COLUMNS: {
  status: ProjectStatus;
  title: string;
  icon: string;
  color: string;
  border: string;
}[] = [
  { status: "inquiry", title: "Inquiries", icon: "inbox", color: "text-cyan-400", border: "border-cyan-400/30" },
  { status: "active", title: "In Progress", icon: "pending_actions", color: "text-primary-light", border: "border-primary/30" },
  { status: "completed", title: "Completed", icon: "task_alt", color: "text-green-400", border: "border-green-400/30" },
];

const ORDER: ProjectStatus[] = ["inquiry", "active", "completed"];

function ProjectsContent() {
  const { user } = useAuth();
  const { projects, loading, createProject, moveProject, deleteProject } =
    useProjects(user?.id);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await createProject({
        title: title.trim(),
        client: client.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setTitle("");
      setClient("");
      setNotes("");
      setShowForm(false);
    } finally {
      setSaving(false);
    }
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
                Track inquiries, active projects and completed work in one place.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition btn-glow"
            >
              <span className="material-icons text-sm">add</span>
              New Project
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="material-icons text-4xl text-primary animate-spin">refresh</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {COLUMNS.map((col) => {
                const items = projects.filter((p) => p.status === col.status);
                return (
                  <div key={col.status} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`material-icons text-lg ${col.color}`}>{col.icon}</span>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        {col.title}
                      </h2>
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${col.color} bg-white/5`}>
                        {items.length}
                      </span>
                    </div>

                    <div className={`space-y-3 p-4 rounded-2xl bg-surface-dark/30 border ${col.border} min-h-[200px]`}>
                      {items.length === 0 ? (
                        <p className="py-8 text-center text-xs text-slate-600">
                          No projects here
                        </p>
                      ) : (
                        items.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onMove={moveProject}
                            onDelete={deleteProject}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* New Project modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreate}
            className="w-full max-w-md bg-surface-dark border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">New Project</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-white transition"
                aria-label="Close"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white">Project title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rooftop launch party"
                className="rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white">
                Client <span className="text-slate-600">(optional)</span>
              </span>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Who is this for?"
                className="rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white">
                Notes <span className="text-slate-600">(optional)</span>
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Anything to remember..."
                className="rounded-xl bg-surface-input border border-white/10 px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </label>

            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition btn-glow disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}

function ProjectCard({
  project,
  onMove,
  onDelete,
}: {
  project: Project;
  onMove: (id: string, status: ProjectStatus) => void;
  onDelete: (id: string) => void;
}) {
  const idx = ORDER.indexOf(project.status);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-xl p-4 group">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight">
          {project.title}
        </h3>
        <button
          onClick={() => onDelete(project.id)}
          className="p-1 rounded-lg hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
          aria-label="Delete project"
        >
          <span className="material-icons text-sm text-slate-500 hover:text-red-400">delete</span>
        </button>
      </div>

      {project.client && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-icons text-primary text-xs">person</span>
          </div>
          <span className="text-xs text-slate-400">{project.client}</span>
        </div>
      )}

      {project.notes && (
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{project.notes}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <button
          onClick={() => prev && onMove(project.id, prev)}
          disabled={!prev}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
        >
          <span className="material-icons text-sm">chevron_left</span>
          Back
        </button>
        <button
          onClick={() => next && onMove(project.id, next)}
          disabled={!next}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition disabled:opacity-30 disabled:pointer-events-none"
        >
          Advance
          <span className="material-icons text-sm">chevron_right</span>
        </button>
      </div>
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
