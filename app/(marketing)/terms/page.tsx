import { DocIcon } from "../../components/ui/Icons";
import { api } from "../../lib/api";
import type { CmsPage } from "../../lib/types";

export default async function TermsPage() {
  let page: CmsPage | null = null;
  try {
    const r = await api.get<CmsPage | null>("/cms/pages/terms_of_service", undefined, { revalidate: 60, skipAuth: true });
    page = r.data || null;
  } catch {
    page = null;
  }

  return (
    <div className="container-page py-14">
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="mx-auto h-14 w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-5">
          <DocIcon size={26} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0e7490]">{page?.title || "Terms & Conditions"}</h1>
        <p className="mt-3 text-slate-600">
          By using Prophetic Pathway, you agree to the following terms and conditions.
        </p>
        <p className="mt-2 text-xs text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>
      </header>

      {page?.content ? (
        <article
          className="prose prose-slate max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-10 text-sm md:text-base leading-relaxed prose-img:rounded-xl prose-a:text-[#0e7490] prose-headings:text-slate-900"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <article className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-10 text-center">
          <p className="text-slate-500 italic">Terms of service content is being prepared. Please check back soon.</p>
        </article>
      )}
    </div>
  );
}
