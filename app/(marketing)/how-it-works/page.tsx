import { CmsCtaButton } from "../../components/ui/Button";
import { Icon, CalendarIcon, CheckIcon } from "../../components/ui/Icons";
import { HowItWorks } from "../../components/sections/HowItWorks";
import { CTA } from "../../components/sections/CTA";
import { FAQSection } from "../../components/sections/FAQSection";
import { getSiteContent } from "../../lib/site-content";

export default async function HowItWorksPage() {
  const data = await getSiteContent("how-it-works");
  const hero = data.hero || {};
  const sessionTypes = data.sessionTypes?.types || [];

  return (
    <>
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 sm:mb-5">
            <CalendarIcon size={26} />
          </div>
          {hero.title && <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">{hero.title}</h1>}
          {hero.subtitle && <p className="mt-4 text-sm sm:text-base text-slate-600">{hero.subtitle}</p>}
          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
            <CmsCtaButton link={hero.ctaPrimary} variant="primary" size="lg" className="w-full sm:w-auto" />
            <CmsCtaButton link={hero.ctaSecondary} variant="outline" size="lg" className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      {data.bookingSteps && (
        <HowItWorks
          title={data.bookingSteps.title}
          subtitle={data.bookingSteps.subtitle}
          steps={data.bookingSteps.steps}
        />
      )}

      {/* Session Types */}
      {sessionTypes.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container-page text-center">
            {data.sessionTypes?.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{data.sessionTypes.title}</h2>}
            {data.sessionTypes?.subtitle && <p className="mt-3 text-sm sm:text-base text-slate-600">{data.sessionTypes.subtitle}</p>}

            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {sessionTypes.map((t, i) => {
                const accent =
                  t.accentColor === "amber"
                    ? { bg: "bg-amber-50", chip: "bg-amber-500", text: "text-amber-600", border: "border-amber-200" }
                    : t.accentColor === "violet"
                      ? { bg: "bg-violet-50", chip: "bg-violet-500", text: "text-violet-600", border: "border-violet-200" }
                      : { bg: "bg-[#e6f4f8]", chip: "bg-[#0e7490]", text: "text-[#0e7490]", border: "border-[#cfe9f0]" };
                return (
                  <div key={i} className={`rounded-2xl border ${accent.border} ${accent.bg} p-6 text-left`}>
                    <div className={`h-12 w-12 rounded-xl ${accent.chip} text-white inline-flex items-center justify-center mb-4`}>
                      <Icon name={t.icon} size={22} />
                    </div>
                    {t.name && <h3 className="text-lg font-semibold text-slate-900 mb-1">{t.name}</h3>}
                    {t.description && <p className="text-sm text-slate-600 mb-4">{t.description}</p>}
                    <ul className="space-y-2 mb-4">
                      {(t.bullets || []).map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckIcon size={14} className={`mt-0.5 ${accent.text} shrink-0`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {t.startingPrice && <div className={`text-sm font-semibold ${accent.text}`}>{t.startingPrice}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Scheduling Made Simple — dark band */}
      {data.schedulingMadeSimple && (
        <section className="py-10 sm:py-14 bg-gradient-to-br from-[#0e7490] to-[#06495d] text-white">
          <div className="container-page text-center">
            {data.schedulingMadeSimple.title && <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{data.schedulingMadeSimple.title}</h2>}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(data.schedulingMadeSimple.cards || []).map((c, i) => (
                <div key={i} className="bg-white text-slate-900 rounded-2xl p-5 text-left">
                  <div className="h-10 w-10 rounded-lg bg-[#0e7490] text-white inline-flex items-center justify-center mb-3">
                    <Icon name={c.icon} size={20} />
                  </div>
                  {c.title && <div className="font-semibold mb-1">{c.title}</div>}
                  {c.description && <p className="text-sm text-slate-600">{c.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cancellation Policy */}
      {data.cancellationPolicy && (
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container-page max-w-3xl text-center">
            {data.cancellationPolicy.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{data.cancellationPolicy.title}</h2>}
            {data.cancellationPolicy.subtitle && <p className="mt-3 text-sm sm:text-base text-slate-600">{data.cancellationPolicy.subtitle}</p>}

            <div className="mt-8 sm:mt-10 rounded-2xl bg-[#e6f4f8] border border-[#cfe9f0] p-4 sm:p-6 text-left">
              {data.cancellationPolicy.sectionTitle && (
                <div className="flex items-center gap-2 mb-4 text-[#0e7490] font-semibold">
                  <Icon name="calendar" size={18} /> {data.cancellationPolicy.sectionTitle}
                </div>
              )}
              <ol className="space-y-4">
                {(data.cancellationPolicy.rules || []).map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="h-6 w-6 rounded-full bg-white text-[#0e7490] text-xs font-bold inline-flex items-center justify-center shrink-0">{i + 1}</span>
                    <div>
                      {r.title && <div className="font-semibold text-slate-900">{r.title}</div>}
                      {r.description && <p className="text-sm text-slate-600 mt-0.5">{r.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />

      {data.cta && (
        <CTA
          title={data.cta.title}
          subtitle={data.cta.subtitle}
          buttonPrimary={data.cta.buttonPrimary}
          iconName="calendar"
          tone="deep"
        />
      )}
    </>
  );
}
