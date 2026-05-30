import Image from "next/image";
import Link from "next/link";
import { CmsCtaButton } from "../../components/ui/Button";
import { Icon, CheckIcon, PlayIcon } from "../../components/ui/Icons";
import { HowItWorks } from "../../components/sections/HowItWorks";
import { WhyChoose } from "../../components/sections/WhyChoose";
import { FAQSection } from "../../components/sections/FAQSection";
import { getSiteContent } from "../../lib/site-content";
import { JoinHeroApplyButton } from "./apply-button";

export default async function JoinAsAdvisorPage() {
  const data = await getSiteContent("join-as-advisor");
  const hero = data.hero || {};

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        {/* Fallback when no image */}
        <div className="absolute inset-0 bg-[#E4FAFF]" aria-hidden="true" />

        {hero.backgroundImage && (
          <Image
            src={hero.backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        )}

        {/* Light gradient overlay — white at bottom, light teal at top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0.47) 27.84%, #E4FAFF 99.8%)",
          }}
          aria-hidden="true"
        />

        <div className="container-page text-center relative z-10 py-16 sm:py-20 md:py-28">
          {hero.title && (
            <h1
              className="font-bold text-[#1A1A1A]"
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                lineHeight: 1,
                letterSpacing: 0,
                fontWeight: 700,
              }}
            >
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <p
              className="mt-4 text-slate-600 max-w-2xl mx-auto"
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontSize: "16px",
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              {hero.subtitle}
            </p>
          )}
          <div className="mt-6 inline-block">
            <JoinHeroApplyButton label={hero.ctaPrimary?.label} />
          </div>
        </div>
      </section>

      {/* Joining process */}
      {data.joiningProcess && (
        <HowItWorks
          sectionLabel={data.joiningProcess.sectionLabel}
          title={data.joiningProcess.title}
          subtitle={data.joiningProcess.subtitle}
          steps={data.joiningProcess.steps}
          numbered
        />
      )}

      {/* Application — text + image */}
      {data.application && (
        <SplitSection
          stepLabel={data.application.stepLabel}
          title={data.application.title}
          description={data.application.description}
          bullets={data.application.bullets}
          image={data.application.image}
          ctaLink={data.application.ctaPrimary}
          imageRight
        />
      )}

      {/* Interview — image + text (reversed) */}
      {data.interview && (
        <SplitSection
          stepLabel={data.interview.stepLabel}
          title={data.interview.title}
          description={data.interview.description}
          image={data.interview.image}
          ctaLink={data.interview.ctaPrimary}
        />
      )}

      {/* Contract */}
      {data.contractOnboarding && (
        <SplitSection
          stepLabel={data.contractOnboarding.stepLabel}
          title={data.contractOnboarding.title}
          description={data.contractOnboarding.description}
          image={data.contractOnboarding.image}
          ctaLink={data.contractOnboarding.ctaPrimary}
          imageRight
        />
      )}

      {/* Stats */}
      {data.reachStats && (
        <section
          className="py-12 sm:py-16 md:py-20 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, #002E3A 0%, #027B98 100%)" }}
        >
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
          <div className="container-page grid lg:grid-cols-2 gap-8 md:gap-10 items-center relative">
            <div>
              {data.reachStats.eyebrow && (
                <div className="text-white/80 text-sm font-medium mb-2">
                  ✦ {data.reachStats.eyebrow}
                </div>
              )}
              {data.reachStats.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                  {data.reachStats.title}
                </h2>
              )}
              {data.reachStats.subtitle && (
                <p className="mt-3 text-sm sm:text-base text-white/85 max-w-xl">
                  {data.reachStats.subtitle}
                </p>
              )}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
                {(data.reachStats.items || []).map((s, i) => {
                  const palette = ["#027B98", "#027B98", "#16a34a", "#ea8a0b"];
                  const valueColor = palette[i % palette.length];
                  return (
                    <div key={i} className="bg-white rounded-xl px-4 py-3.5 shadow-sm">
                      <div className="text-xl sm:text-2xl font-bold" style={{ color: valueColor }}>
                        {s.value}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              {data.reachStats.image ? (
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.reachStats.image}
                    alt={data.reachStats.title || ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-4/3 rounded-2xl bg-white/10" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why Join */}
      {data.whyJoin && (
        <WhyChoose
          sectionLabel={data.whyJoin.sectionLabel}
          title={data.whyJoin.title}
          subtitle={data.whyJoin.subtitle}
          cards={data.whyJoin.cards}
          centered
        />
      )}

      {/* Requirements */}
      {data.requirements && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container-page grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              {data.requirements.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-5 sm:mb-6">
                  {data.requirements.title}
                </h2>
              )}
              <ul className="space-y-3">
                {(data.requirements.bullets || []).map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center shrink-0">
                      <CheckIcon size={12} />
                    </span>
                    <span className="text-sm sm:text-base">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            {data.requirements.image ? (
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.requirements.image}
                  alt={data.requirements.title || ""}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-4/3 rounded-2xl bg-slate-100" />
            )}
          </div>
        </section>
      )}

      {/* Advisor video testimonials */}
      {data.advisorTestimonials && (
        <section className="py-12 sm:py-16 md:py-20 bg-[#f0f9fb]">
          <div className="container-page text-center">
            {data.advisorTestimonials.sectionLabel && (
              <div className="text-[#0e7490] text-sm font-semibold mb-2">
                + {data.advisorTestimonials.sectionLabel}
              </div>
            )}
            {data.advisorTestimonials.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                {data.advisorTestimonials.title}
              </h2>
            )}

            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {(data.advisorTestimonials.videos || []).map((v, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-slate-900">
                    {v.videoUrl ? (
                      <video
                        src={v.videoUrl}
                        poster={v.thumbnail || undefined}
                        controls
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : v.thumbnail ? (
                      <Image
                        src={v.thumbnail}
                        alt={v.name || ""}
                        fill
                        className="object-cover"
                        sizes="400px"
                        unoptimized
                      />
                    ) : null}
                    {!v.videoUrl && (
                      <div className="absolute inset-0 grid place-items-center text-white pointer-events-none">
                        <span className="h-14 w-14 rounded-full bg-white/95 text-[#0e7490] inline-flex items-center justify-center shadow-xl">
                          <PlayIcon size={24} />
                        </span>
                      </div>
                    )}
                  </div>
                  {(v.name || v.quote) && (
                    <div className="px-4 py-3 text-left">
                      {v.name && <div className="font-semibold text-slate-900">{v.name}</div>}
                      {v.quote && (
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                          {v.quote}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Before You Apply */}
      {data.beforeYouApply && (
        <section
          className="py-12 sm:py-16 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, #002E3A 0%, #015267 100%)" }}
        >
          <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center relative">
            <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white text-[#027B98] inline-flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
              <Icon name="shield-check" size={28} />
            </div>
            {data.beforeYouApply.eyebrow && (
              <div className="text-white/70 text-sm font-semibold mb-2">
                + {data.beforeYouApply.eyebrow}
              </div>
            )}
            {data.beforeYouApply.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {data.beforeYouApply.title}
              </h2>
            )}
            {data.beforeYouApply.body && (
              <p className="mt-3 text-sm sm:text-base text-white/85 max-w-3xl mx-auto leading-relaxed">
                {data.beforeYouApply.body}
              </p>
            )}
            <div className="mt-6">
              {data.beforeYouApply.ctaPrimary?.href ? (
                <Link
                  href={data.beforeYouApply.ctaPrimary.href}
                  className="inline-flex items-center gap-2 h-13 px-8 rounded-xl bg-white hover:bg-slate-50 transition-colors text-[#0e7490] font-semibold shadow-lg"
                >
                  <Icon name="shield-check" size={18} /> {data.beforeYouApply.ctaPrimary.label}
                </Link>
              ) : null}
            </div>
            {data.beforeYouApply.footnote && (
              <p className="mt-3 text-xs text-white/70">{data.beforeYouApply.footnote}</p>
            )}
          </div>
        </section>
      )}

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />
    </>
  );
}

function SplitSection({
  stepLabel,
  title,
  description,
  bullets,
  image,
  ctaLink,
  imageRight,
}: {
  stepLabel?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  image?: string;
  ctaLink?: { label?: string; href?: string };
  imageRight?: boolean;
}) {
  const text = (
    <div>
      {stepLabel && (
        <div className="text-[#0e7490] text-sm font-semibold mb-2">+ {stepLabel}</div>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0e7490] mb-4 leading-tight">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="mt-5 space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-[#e6f4f8] text-[#0e7490] inline-flex items-center justify-center shrink-0">
                <CheckIcon size={12} />
              </span>
              <span className="text-sm sm:text-base">{b}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <CmsCtaButton link={ctaLink} variant="primary" size="md" />
      </div>
    </div>
  );

  const img = image ? (
    <div className="aspect-square rounded-full overflow-hidden max-w-xs sm:max-w-sm md:max-w-md mx-auto shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title || ""}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  ) : (
    <div className="aspect-square rounded-full bg-[#e6f4f8] max-w-xs sm:max-w-sm md:max-w-md mx-auto" />
  );

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="container-page grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
        {imageRight ? (
          <>
            {text}
            {img}
          </>
        ) : (
          <>
            {img}
            {text}
          </>
        )}
      </div>
    </section>
  );
}
