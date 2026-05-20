import { DocIcon } from "../../components/ui/Icons";
import { api } from "../../lib/api";
import type { CmsPage } from "../../lib/types";

export default async function TermsPage() {
  let page: CmsPage | null = null;
  try {
    const r = await api.get<CmsPage | null>("/cms/pages/terms_of_service", undefined, {
      revalidate: 60,
      skipAuth: true,
    });
    page = r.data || null;
  } catch {
    page = null;
  }

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <section className="py-10 sm:py-14 md:py-20 bg-linear-to-b from-[#f0f9fb] to-white">
        <div className="container-page text-center max-w-3xl mx-auto">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 sm:mb-5 shadow-md">
            <DocIcon size={26} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">
            {page?.title || "Terms & Conditions"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            By using Prophetic Pathway, you agree to the following terms and conditions.
          </p>
          <p className="mt-2 text-xs text-slate-500">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="pb-12 sm:pb-16 md:pb-20 bg-white">
        <div className="container-page max-w-4xl">
          {page?.content ? (
            <article
              className="prose prose-slate max-w-none bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-10 text-sm md:text-base leading-relaxed prose-img:rounded-xl prose-a:text-[#0e7490] prose-headings:text-slate-900"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <article className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-10 text-center">
              <p className="text-slate-500 italic">
                Terms of service content is being prepared. Please check back soon.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
