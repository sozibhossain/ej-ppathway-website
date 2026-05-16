"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button";
import { StarIcon } from "../ui/Icons";
import type { Advisor } from "../../lib/types";

export function AdvisorCard({ advisor }: { advisor: Advisor }) {
  const { user, profile } = advisor;
  const tierLabel =
    profile?.tier === "gold" ? "Top Rated" : profile?.tier === "silver" ? "Verified" : "New";

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-slate-100">
        {user.profilePhoto ? (
          <Image src={user.profilePhoto} alt={user.name || "Advisor"} fill className="object-cover" sizes="240px" unoptimized />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-400 text-3xl">👤</div>
        )}
        {profile?.isOnline && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> Online
          </span>
        )}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">
          ★ {tierLabel}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-semibold text-slate-900 truncate text-sm sm:text-base min-w-0">{user.name || "Advisor"}</div>
          <div className="text-xs text-amber-500 inline-flex items-center gap-1 shrink-0">
            <StarIcon size={12} />
            {(profile?.avgRating || 0).toFixed(1)}
          </div>
        </div>
        {profile?.expertise && profile.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.expertise.slice(0, 2).map((e) => (
              <span key={e} className="px-2 py-0.5 rounded-full bg-[#e6f4f8] text-[#0e7490] text-[10px] font-medium">{e}</span>
            ))}
          </div>
        )}
        <div className="text-xs sm:text-sm text-slate-700 mt-auto pt-3 border-t border-slate-100 mb-3">
          ${profile?.pricing?.chatPerMin?.toFixed(2) || "1.00"}/min
        </div>
        <Link href={`/advisors/${user._id}`} className="block">
          <Button size="sm" className="w-full">View Profile</Button>
        </Link>
      </div>
    </article>
  );
}
