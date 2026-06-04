"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button";
import { StarIcon } from "../ui/Icons";
import { useCurrencyCatalog, symbolFor } from "../../lib/currency";
import { useCountries, currencyCodeFrom } from "../../lib/countries";
import type { Advisor } from "../../lib/types";

export function AdvisorCard({ advisor }: { advisor: Advisor }) {
  const { user, profile } = advisor;
  useCurrencyCatalog();
  const countries = useCountries();
  // Symbol follows the advisor's selected country (fall back to stored currency).
  const symbol = symbolFor(
    currencyCodeFrom(countries, user.country) || user.currency,
  );
  const tierLabel =
    profile?.tier === "gold" ? "Top Rated" : profile?.tier === "silver" ? "Verified" : "New";
  const tierClass =
    profile?.tier === "gold"
      ? "bg-purple-100 text-purple-700"
      : profile?.tier === "silver"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-700";

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative aspect-4/3 bg-slate-100">
        {user.profilePhoto ? (
          <Image
            src={user.profilePhoto}
            alt={user.name || "Advisor"}
            fill
            className="object-cover"
            sizes="240px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-400 text-3xl">👤</div>
        )}
        {profile?.isOnline && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-medium shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> Online
          </span>
        )}
        <span
          className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${tierClass} text-[10px] font-semibold shadow-sm`}
        >
          ★ {tierLabel}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-semibold text-slate-900 truncate text-sm sm:text-base min-w-0">
            {user.name || "Advisor"}
          </div>
          <div className="text-xs text-amber-500 inline-flex items-center gap-1 shrink-0">
            <StarIcon size={12} />
            <span className="text-slate-700 font-medium">
              {(profile?.avgRating || 0).toFixed(1)}
              {profile?.ratingsCount ? ` (${profile.ratingsCount})` : ""}
            </span>
          </div>
        </div>
        {profile?.expertise && profile.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.expertise.slice(0, 2).map((e) => (
              <span
                key={e}
                className="px-2 py-0.5 rounded-full bg-[#e6f4f8] text-[#0e7490] text-[10px] font-medium"
              >
                {e}
              </span>
            ))}
          </div>
        )}
        <div className="text-xs sm:text-sm text-slate-700 mt-auto pt-3 border-t border-slate-100 mb-3">
          <span className="font-semibold">
            {symbol}
            {profile?.pricing?.chatPerMin?.toFixed(2) || "1.00"}
          </span>
          <span className="text-slate-500">/min</span>
        </div>
        <Link href={`/advisors/${user._id}`} className="block">
          <Button size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </article>
  );
}
