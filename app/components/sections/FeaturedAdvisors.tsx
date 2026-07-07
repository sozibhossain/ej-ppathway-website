import { Suspense } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "../ui/Icons";
import { AdvisorCard } from "../cards/AdvisorCard";
import { AdvisorCardSkeleton } from "../ui/Skeleton";
import { api } from "../../lib/api";
import type { Advisor } from "../../lib/types";

type Props = {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
};

export function FeaturedAdvisors({ sectionLabel, title, subtitle, viewAllLabel }: Props) {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-[#eaf4f8]">
      <div className="container-page text-center">
        {sectionLabel && (
          <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">
            + {sectionLabel}
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 max-w-3xl mx-auto leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        )}

        <Suspense fallback={<FeaturedAdvisorsSkeletonGrid />}>
          <FeaturedAdvisorsGrid />
        </Suspense>

        {viewAllLabel && (
          <div className="mt-8 sm:mt-10">
            <Link
              href="/advisors"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white border border-slate-200 text-slate-800 font-medium hover:border-[#0e7490] hover:text-[#0e7490] transition-colors"
            >
              {viewAllLabel} <ArrowRightIcon size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

async function FeaturedAdvisorsGrid() {
  let advisors: Advisor[] = [];
  try {
    const r = await api.get<Advisor[]>("/advisors/featured", { limit: 6 }, { revalidate: 60, skipAuth: true });
    advisors = r.data || [];
  } catch {
    advisors = [];
  }

  if (advisors.length === 0) return <FeaturedAdvisorsSkeletonGrid />;

  return (
    <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {advisors.map((a) => (
        <AdvisorCard key={a.user._id} advisor={a} />
      ))}
    </div>
  );
}

function FeaturedAdvisorsSkeletonGrid() {
  return (
    <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <AdvisorCardSkeleton key={i} />
      ))}
    </div>
  );
}
