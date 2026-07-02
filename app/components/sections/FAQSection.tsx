import { Suspense } from "react";
import { Accordion } from "../ui/Accordion";
import { FaqItemSkeleton } from "../ui/Skeleton";
import { api } from "../../lib/api";
import type { Faq } from "../../lib/types";

export function FAQSection({ sectionLabel, title }: { sectionLabel?: string; title?: string }) {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container-page max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          {sectionLabel && (
            <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">
              + {sectionLabel}
            </div>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-slate-950 leading-tight">{title}</h2>
          )}
        </div>

        <div className="text-left">
          <Suspense fallback={<FaqListSkeleton />}>
            <FaqList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function FaqList() {
  let faqs: Faq[] = [];
  try {
    const r = await api.get<Faq[]>("/cms/faqs", undefined, { revalidate: 60, skipAuth: true });
    faqs = r.data || [];
  } catch {
    faqs = [];
  }

  if (faqs.length === 0) {
    return <div className="text-center text-sm text-slate-500 py-8">No FAQs yet.</div>;
  }

  return <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />;
}

function FaqListSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaqItemSkeleton key={i} />
      ))}
    </div>
  );
}
