import { Suspense } from "react";
import { AdvisorCard } from "../../components/cards/AdvisorCard";
import { AdvisorCardSkeleton } from "../../components/ui/Skeleton";
import { api } from "../../lib/api";
import { getSiteContent } from "../../lib/site-content";
import type { Advisor } from "../../lib/types";

export default async function AdvisorsListPage() {
  const data = await getSiteContent("advisors");

  return (
    <>
      <section className="py-7 sm:py-10 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl mx-auto">
          {data.hero?.eyebrow && (
            <div className="text-[#0e7490] text-sm font-semibold mb-2">+ {data.hero.eyebrow}</div>
          )}
          {data.hero?.title && (
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              {data.hero.title}
            </h1>
          )}
          {data.hero?.subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {data.hero.subtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-7 sm:py-9 md:py-11 bg-white">
        <div className="container-page">
          <Suspense fallback={<AdvisorsGridSkeleton />}>
            <AdvisorsGrid emptyStateText={data.listSettings?.emptyStateText} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function AdvisorsGrid({ emptyStateText }: { emptyStateText?: string }) {
  let advisors: Advisor[] = [];
  try {
    const r = await api.get<Advisor[]>("/advisors/search", { limit: 24 }, {
      revalidate: 60,
      skipAuth: true,
    });
    advisors = r.data || [];
  } catch {
    advisors = [];
  }

  if (advisors.length === 0) {
    return (
      <p className="text-center text-slate-500 py-20">
        {emptyStateText || "No advisors found yet."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {advisors.map((a) => (
        <AdvisorCard key={a.user._id} advisor={a} />
      ))}
    </div>
  );
}

function AdvisorsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <AdvisorCardSkeleton key={i} />
      ))}
    </div>
  );
}
