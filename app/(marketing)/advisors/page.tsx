import { AdvisorCard } from "../../components/cards/AdvisorCard";
import { api } from "../../lib/api";
import { getSiteContent } from "../../lib/site-content";
import type { Advisor } from "../../lib/types";

export default async function AdvisorsListPage() {
  const data = await getSiteContent("advisors");
  let advisors: Advisor[] = [];
  try {
    const r = await api.get<Advisor[]>("/advisors/search", { limit: 24 }, { revalidate: 60, skipAuth: true });
    advisors = r.data || [];
  } catch {
    advisors = [];
  }

  return (
    <>
      <section className="py-10 sm:py-14 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl">
          {data.hero?.eyebrow && <div className="text-[#0e7490] text-sm font-semibold mb-2">+ {data.hero.eyebrow}</div>}
          {data.hero?.title && <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900">{data.hero.title}</h1>}
          {data.hero?.subtitle && <p className="mt-3 text-sm sm:text-base text-slate-600">{data.hero.subtitle}</p>}
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-page">
          {advisors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {advisors.map((a) => (
                <AdvisorCard key={a.user._id} advisor={a} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-20">
              {data.listSettings?.emptyStateText || "No advisors found yet."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
