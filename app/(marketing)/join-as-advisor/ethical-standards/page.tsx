import { CmsCtaButton } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icons";
import { FAQSection } from "../../../components/sections/FAQSection";
import { getSiteContent } from "../../../lib/site-content";

export default async function EthicalStandardsPage() {
  const data = await getSiteContent("ethical-standards");
  const hero = data.hero || {};

  return (
    <>
      <section className="py-16 md:py-20 bg-[url('/grid.svg')] bg-center bg-cover relative">
        <div className="container-page text-center max-w-3xl relative z-10">
          <div className="mx-auto h-14 w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-5">
            <Icon name="shield-check" size={26} />
          </div>
          {hero.title && <h1 className="text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">{hero.title}</h1>}
          {hero.subtitle && <p className="mt-3 text-slate-700">{hero.subtitle}</p>}
          {hero.banner && (
            <div className="mt-5 inline-flex items-start gap-2 bg-white border border-amber-200 rounded-xl px-4 py-3 text-left text-sm text-slate-700 max-w-2xl">
              <span className="mt-0.5 text-amber-500">ⓘ</span>
              {hero.banner}
            </div>
          )}
        </div>
      </section>

      {/* Standards grid */}
      <section className="py-12 md:py-16">
        <div className="container-page grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data.standards || []).map((s, i) => (
            <div key={i} className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4">
                <Icon name={s.icon} size={22} />
              </div>
              {s.title && <h3 className="text-lg font-semibold text-slate-900 mb-1">{s.title}</h3>}
              {s.description && <p className="text-sm text-slate-600">{s.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Commitment band */}
      {data.commitment && (
        <section className="py-14 bg-gradient-to-br from-[#0e7490] to-[#06495d] text-white">
          <div className="container-page text-center max-w-3xl">
            <div className="mx-auto h-14 w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-5">
              <Icon name="sparkle" size={26} />
            </div>
            {data.commitment.title && <h2 className="text-2xl md:text-3xl font-bold">{data.commitment.title}</h2>}
            {data.commitment.body && (
              <p className="mt-3 text-white/85 whitespace-pre-line leading-relaxed">{data.commitment.body}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <CmsCtaButton link={data.commitment.ctaPrimary} variant="white" size="md" />
              <CmsCtaButton link={data.commitment.ctaSecondary} variant="outline" size="md" className="!border-white !text-white hover:!bg-white/10" />
            </div>
          </div>
        </section>
      )}

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />
    </>
  );
}
