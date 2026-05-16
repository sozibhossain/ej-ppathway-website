import { Accordion } from "../ui/Accordion";
import { api } from "../../lib/api";
import type { Faq } from "../../lib/types";

export async function FAQSection({ sectionLabel, title }: { sectionLabel?: string; title?: string }) {
  let faqs: Faq[] = [];
  try {
    const r = await api.get<Faq[]>("/cms/faqs", undefined, { revalidate: 60, skipAuth: true });
    faqs = r.data || [];
  } catch {
    faqs = [];
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container-page text-center max-w-3xl">
        {sectionLabel && <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">+ {sectionLabel}</div>}
        {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">{title}</h2>}

        <div className="text-left">
          {faqs.length > 0 ? (
            <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          ) : (
            <div className="text-center text-sm text-slate-500 py-8">No FAQs yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
