import Image from "next/image";
import { CmsCtaButton } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icons";
import { FAQSection } from "../../../components/sections/FAQSection";
import { getSiteContent } from "../../../lib/site-content";

export default async function EthicalStandardsPage() {
  const data = await getSiteContent("ethical-standards");
  const hero = data.hero || {};

  return (
    <>
      {/* Hero with background image */}
      <section className="relative py-8 sm:py-10 md:py-14 overflow-hidden bg-linear-to-br from-[#082e3a]/85 to-[#0e5d75]/75">
        {hero.backgroundImage && (
          <Image
            src={hero.backgroundImage}
            alt=""
            fill
            className="object-cover -z-10 opacity-25"
            unoptimized
            priority
          />
        )}
        <div className="container-page text-center max-w-3xl relative z-10">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
            <Icon name="shield-check" size={26} />
          </div>
          {hero.title && (
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-700">{hero.subtitle}</p>
          )}
          {hero.banner && (
            <div className="mt-5 inline-flex items-start gap-2 bg-white border border-amber-200 rounded-xl px-4 py-3 text-left text-sm text-slate-700 max-w-2xl shadow-sm">
              <span className="mt-0.5 text-amber-500">ⓘ</span>
              <span>{hero.banner}</span>
            </div>
          )}
        </div>
      </section>

      {/* Standards grid */}
      <section className="py-7 sm:py-9 md:py-11 bg-white">
        <div className="container-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {(data.standards || []).map((s, i) => (
            <div
              key={i}
              className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-6 text-center hover:border-[#9ed3df] hover:shadow-md transition-all"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 shadow-sm">
                <Icon name={s.icon} size={22} />
              </div>
              {s.title && (
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5">
                  {s.title}
                </h3>
              )}
              {s.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Commitment band */}
      {data.commitment && (
        <section className="py-7 sm:py-10 bg-linear-to-br from-[#082e3a] to-[#0e5d75] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center max-w-3xl relative">
            <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
              <Icon name="sparkle" size={26} />
            </div>
            {data.commitment.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{data.commitment.title}</h2>
            )}
            {data.commitment.body && (
              <p className="mt-3 text-sm sm:text-base text-white/85 whitespace-pre-line leading-relaxed">
                {data.commitment.body}
              </p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
              <CmsCtaButton
                link={data.commitment.ctaPrimary}
                variant="white"
                size="md"
                className="w-full sm:w-auto"
              />
              <CmsCtaButton
                link={data.commitment.ctaSecondary}
                variant="outline"
                size="md"
                className="border-white! text-white! hover:bg-white/10! w-full sm:w-auto"
              />
            </div>
          </div>
        </section>
      )}

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />
    </>
  );
}
