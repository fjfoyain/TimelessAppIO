"use client";

import Image from "next/image";
import Link from "next/link";
import { TalentWithUser } from "@/data/mockTalents";

function getAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export default function TalentCard({ talent, user }: TalentWithUser) {
  const avgRating = getAverageRating(talent.reviews);

  return (
    <Link href={`/marketplace/${talent.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card-dark transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
        {/* Image Area */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={user.avatar || "/images/avatar-producer.jpg"}
            alt={user.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card-dark via-card-dark/20 to-transparent" />

          {/* Verified Badge */}
          {talent.isVerified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary/80 backdrop-blur-sm px-2.5 py-1">
              <span className="material-icons text-white text-xs">verified</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Verified</span>
            </div>
          )}

          {/* City Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/70">
            <span className="material-icons text-xs">place</span>
            <span className="text-xs font-medium">{talent.city}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-light transition-colors truncate">
              {user.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <span className="material-icons text-yellow-400 text-sm">star</span>
              <span className="text-sm font-semibold text-white">{avgRating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-sm text-primary-light font-medium">{talent.category}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {talent.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {talent.tags.length > 3 && (
              <span className="text-[10px] text-slate-600">+{talent.tags.length - 3}</span>
            )}
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <span className="text-lg font-bold text-white">
              ${talent.hourlyRate}
              <span className="text-xs text-slate-500 font-normal">/hr</span>
            </span>
            <span className="text-xs text-slate-500">{talent.jobsCompleted} jobs</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
