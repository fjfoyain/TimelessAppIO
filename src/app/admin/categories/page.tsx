"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

interface Category {
  id: string;
  name: string;
  parent: string;
  itemCount: number;
  icon: string;
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Music Production",
    parent: "Services",
    itemCount: 245,
    icon: "music_note",
  },
  {
    id: "2",
    name: "DJs & Live Acts",
    parent: "Services",
    itemCount: 189,
    icon: "headphones",
  },
  {
    id: "3",
    name: "Sound Engineering",
    parent: "Services",
    itemCount: 134,
    icon: "graphic_eq",
  },
  {
    id: "4",
    name: "Nightclubs",
    parent: "Venues",
    itemCount: 87,
    icon: "nightlife",
  },
  {
    id: "5",
    name: "Concert Halls",
    parent: "Venues",
    itemCount: 56,
    icon: "stadium",
  },
  {
    id: "6",
    name: "Recording Studios",
    parent: "Venues",
    itemCount: 72,
    icon: "mic",
  },
  {
    id: "7",
    name: "Photography",
    parent: "Services",
    itemCount: 112,
    icon: "photo_camera",
  },
  {
    id: "8",
    name: "Event Planning",
    parent: "Services",
    itemCount: 98,
    icon: "event",
  },
];

export default function CategoriesPage() {
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
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-glow transition-all duration-300">
              <span className="material-icons text-lg">add</span>
              Add Category
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {mockCategories.map((category) => (
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
                    <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                      <span className="material-icons text-lg">edit</span>
                    </button>
                    <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <span className="material-icons text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </AdminLayout>
  );
}
