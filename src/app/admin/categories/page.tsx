"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { useCategories } from "@/hooks/useFirestore";
import type { Category } from "@/types";

function AddCategoryModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: Omit<Category, "id">) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("Services");
  const [icon, setIcon] = useState("category");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onAdd({ name: name.trim(), parent, icon, itemCount: 0 });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-white mb-4">Add Category</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Music Production"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Parent</label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="Services">Services</option>
              <option value="Venues">Venues</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Icon (Material Icons name)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. music_note"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCategoryModal({
  category,
  onClose,
  onSave,
}: {
  category: Category;
  onClose: () => void;
  onSave: (id: string, data: Partial<Omit<Category, "id">>) => Promise<void>;
}) {
  const [name, setName] = useState(category.name);
  const [parent, setParent] = useState(category.parent);
  const [icon, setIcon] = useState(category.icon);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave(category.id, { name: name.trim(), parent, icon });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-white mb-4">Edit Category</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Parent</label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="Services">Services</option>
              <option value="Venues">Venues</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Icon (Material Icons name)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, loading, create, update, remove } = useCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background-dark relative">
        <AnimatedBackground />
        <Navbar />

        <div className="relative z-10 pt-24 pb-16 px-6 lg:px-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Manage Categories
              </h1>
              <p className="text-gray-500">
                Organize platform services and venue types
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300"
            >
              <span className="material-icons text-lg">add</span>
              Add Category
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-16 text-center">
              <span className="material-icons text-4xl text-primary animate-spin mb-3 block">hourglass_empty</span>
              <p className="text-sm text-gray-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            /* Empty State */
            <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
              <span className="material-icons text-5xl text-gray-700 mb-3 block">category</span>
              <h3 className="text-lg font-semibold text-white mb-2">No categories yet</h3>
              <p className="text-sm text-gray-500 mb-6">Add your first category to organize the platform.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300"
              >
                <span className="material-icons text-lg">add</span>
                Add Category
              </button>
            </div>
          ) : (
            /* Category List */
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="material-icons text-lg text-primary">
                          {category.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm group-hover:text-primary-light transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="material-icons text-xs">
                              folder
                            </span>
                            {category.parent}
                          </span>
                          <span className="text-xs text-gray-600">|</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="material-icons text-xs">
                              inventory_2
                            </span>
                            {category.itemCount} items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <span className="material-icons text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${category.name}"?`)) {
                            remove(category.id);
                          }
                        }}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <span className="material-icons text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />

        {/* Modals */}
        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            onAdd={create}
          />
        )}
        {editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSave={update}
          />
        )}
      </div>
    </AdminLayout>
  );
}
