"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { useCourses } from "@/hooks/useFirestore";
import type { Course } from "@/types";

const tabs = ["All", "DJing", "Production", "Masterclasses"] as const;

const mockCourses: Course[] = [
  {
    id: "mock-1",
    title: "Intro to DJing: From Zero to First Set",
    category: "DJing",
    instructor: "DJ Nova",
    price: 49,
    color: "from-purple-600 to-blue-600",
    icon: "album",
  },
  {
    id: "mock-2",
    title: "Beat Making with Ableton Live",
    category: "Production",
    instructor: "Marcus Cole",
    price: 79,
    color: "from-pink-600 to-red-600",
    icon: "piano",
  },
  {
    id: "mock-3",
    title: "Vinyl Culture & Turntablism",
    category: "DJing",
    instructor: "Scratch Master K",
    price: 59,
    color: "from-cyan-600 to-teal-600",
    icon: "music_note",
  },
  {
    id: "mock-4",
    title: "Advanced Mixing & Mastering",
    category: "Masterclasses",
    instructor: "Elena Voss",
    price: 129,
    color: "from-amber-600 to-orange-600",
    icon: "equalizer",
  },
  {
    id: "mock-5",
    title: "Sound Design for Film & Games",
    category: "Production",
    instructor: "Kai Tanaka",
    price: 99,
    color: "from-green-600 to-emerald-600",
    icon: "graphic_eq",
  },
  {
    id: "mock-6",
    title: "Building Your Brand as an Artist",
    category: "Masterclasses",
    instructor: "Zara Mitchell",
    price: 69,
    color: "from-violet-600 to-fuchsia-600",
    icon: "trending_up",
  },
];

export default function StudioClassesPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const { courses: firestoreCourses, loading } = useCourses();

  // Use Firestore data if available, otherwise fall back to mock
  const allCourses = firestoreCourses.length > 0 ? firestoreCourses : mockCourses;

  const filteredCourses =
    activeTab === "All"
      ? allCourses
      : allCourses.filter((c) => c.category === activeTab);

  return (
    <div className="min-h-screen bg-background-dark">
      <AnimatedBackground />
      <Navbar activeTab="studio" />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
                Master the Art of
              </span>
              <br />
              <span className="text-white">Sound Engineering</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Learn from industry professionals. Whether you are a beginner or looking to level up,
              our curated classes will help you craft your legacy.
            </p>
          </section>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-glow"
                    : "bg-surface-dark border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <span className="material-icons text-4xl text-primary animate-pulse">school</span>
              <p className="text-slate-500 ml-3">Loading classes...</p>
            </div>
          )}

          {/* Course Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-surface-dark/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image Placeholder */}
                  <div
                    className={`h-44 bg-gradient-to-br ${course.color || "from-purple-600 to-blue-600"} flex items-center justify-center relative`}
                  >
                    <span className="material-icons text-white/30 text-6xl">{course.icon || "school"}</span>
                    <span className="absolute top-3 left-3 inline-flex px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs font-bold text-white">
                      {course.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold mb-2 group-hover:text-primary-light transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                      <span className="material-icons text-sm">person</span>
                      {course.instructor}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">${course.price}</span>
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-xs font-semibold text-white hover:shadow-glow transition-all duration-300">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <span className="material-icons text-5xl text-slate-700 mb-3 block">search_off</span>
              <p className="text-slate-500">No classes found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
