import Link from "next/link";
import { ArrowRightIcon } from "../ui/Icons";
import { AdvisorCard } from "../cards/AdvisorCard";
import { api } from "../../lib/api";
import type { Advisor } from "../../lib/types";

export async function FeaturedAdvisors({
  sectionLabel,
  title,
  subtitle,
  viewAllLabel
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
}) {
  let advisors: Advisor[] = [];
  try {
    const r = await api.get<Advisor[]>("/advisors/featured", { limit: 6 }, { revalidate: 60, skipAuth: true });
    advisors = r.data || [];
  } catch {
    advisors = [];
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#eaf4f8]">
      <div className="container-page text-center">
        {sectionLabel && <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">+ {sectionLabel}</div>}
        {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 max-w-3xl mx-auto">{title}</h2>}
        {subtitle && <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}

        {advisors.length > 0 ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {advisors.map((a) => (
              <AdvisorCard key={a.user._id} advisor={a} />
            ))}
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 aspect-[3/4] flex flex-col">
                <div className="bg-slate-100 rounded-t-2xl aspect-[4/3]" />
                <div className="p-3 flex flex-col flex-1 gap-2">
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-2 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {viewAllLabel && (
          <Link
            href="/advisors"
            className="mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white border border-slate-200 text-slate-800 font-medium hover:border-[#0e7490] hover:text-[#0e7490]"
          >
            {viewAllLabel} <ArrowRightIcon size={16} />
          </Link>
        )}
      </div>
    </section>
  );
}
