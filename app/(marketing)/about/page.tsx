import { HowItWorks } from "../../components/sections/HowItWorks";
import { WhyChoose } from "../../components/sections/WhyChoose";
import { CTA } from "../../components/sections/CTA";
import { getSiteContent } from "../../lib/site-content";

export default async function AboutPage() {
  const data = await getSiteContent("about");
  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-page text-center max-w-4xl">
          {data.hero?.title && <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">{data.hero.title}</h1>}
          {data.hero?.subtitle && <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">{data.hero.subtitle}</p>}
        </div>
      </section>

      {data.story && (
        <section className="py-8 md:py-12">
          <div className="container-page max-w-3xl">
            <div className="rounded-2xl border border-[#cfe9f0] bg-[#f0f9fb] p-6 md:p-8">
              {data.story.title && <h2 className="text-2xl font-bold text-slate-900 mb-4">{data.story.title}</h2>}
              <div className="space-y-3 text-slate-700 leading-relaxed text-sm md:text-base">
                {(data.story.paragraphs || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {data.values && (
        <section className="py-10 sm:py-12 md:py-16">
          <div className="container-page text-center">
            {data.values.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 sm:mb-10">{data.values.title}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {(data.values.cards || []).map((c, i) => (
                <div key={i} className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-5 text-left">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center shrink-0">
                      <span className="text-lg">✦</span>
                    </div>
                    <div>
                      {c.title && <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>}
                      {c.description && <p className="text-sm text-slate-600">{c.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.howItWorks && (
        <HowItWorks
          sectionLabel={data.howItWorks.sectionLabel}
          title={data.howItWorks.title}
          subtitle={data.howItWorks.subtitle}
          steps={data.howItWorks.steps}
        />
      )}

      {data.whyChoose && (
        <WhyChoose
          sectionLabel={data.whyChoose.sectionLabel}
          title={data.whyChoose.title}
          subtitle={data.whyChoose.subtitle}
          cards={data.whyChoose.cards}
        />
      )}

      {data.cta && (
        <CTA
          title={data.cta.title}
          subtitle={data.cta.subtitle}
          buttonPrimary={data.cta.buttonPrimary}
          buttonSecondary={data.cta.buttonSecondary}
          iconName="calendar"
          tone="deep"
        />
      )}
    </>
  );
}
