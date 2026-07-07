import Image from "next/image";
import { CmsCtaButton } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icons";
import { FAQSection } from "../../../components/sections/FAQSection";
import { getSiteContent } from "../../../lib/site-content";

const HERO_FALLBACK = "/ethical-standards-hero.png";

export default async function EthicalStandardsPage() {
  const data = await getSiteContent("ethical-standards");
  const hero = data.hero || {};
  const configuredHeroImage = hero.backgroundImage?.trim();
  const heroImage = configuredHeroImage && !configuredHeroImage.startsWith("linear-gradient")
    ? configuredHeroImage
    : HERO_FALLBACK;

  return (
    <>
      <section className="relative min-h-[390px] overflow-hidden bg-[#dceff2] py-12 sm:py-16 md:min-h-[480px] md:py-20">
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover opacity-100"
            sizes="100vw"
            unoptimized
            priority
          />
        )}
        <div className="absolute inset-0 bg-white/62" aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-b from-white/0 to-white"
          aria-hidden="true"
        />
        <div className="container-page relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-5 inline-flex h-18 w-18 items-center justify-center rounded-[12px] bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.18)] ring-1 ring-white">
            <span className="inline-flex h-13 w-13 items-center justify-center rounded-[8px] bg-[#0785a3] text-white">
              <Icon name="shield-check" size={25} />
            </span>
          </div>
          {hero.title && (
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.04] text-[#007d9d] sm:text-5xl md:text-[64px]">
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <p className="mt-4 max-w-3xl text-xs font-medium leading-relaxed text-slate-800 sm:text-sm">
              {hero.subtitle}
            </p>
          )}
          {hero.banner && (
            <div className="mt-5 flex w-full max-w-[620px] items-start gap-3 rounded-[6px] bg-white px-4 py-3 text-left text-xs font-medium leading-snug text-slate-900 shadow-sm ring-1 ring-slate-200 sm:px-5 sm:text-sm">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[11px] text-slate-500">
                !
              </span>
              <span className="flex-1">{hero.banner}</span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white pb-12 pt-3 sm:pb-16 md:pb-20">
        <div className="container-page grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {(data.standards || []).map((s, i) => (
            <div
              key={i}
              className="min-h-[158px] rounded-[13px] border border-[#18a2bf]/70 bg-[#eefcff] px-6 py-6 text-center shadow-[0_2px_8px_rgba(0,125,157,0.12)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(0,125,157,0.14)]"
            >
              <div className="mx-auto mb-5 inline-flex h-13 w-13 items-center justify-center rounded-[8px] bg-white shadow-sm ring-1 ring-slate-200">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#0785a3] text-white">
                  <Icon name={s.icon} size={20} />
                </span>
              </div>
              {s.title && (
                <h3 className="mb-3 text-lg font-bold leading-tight text-slate-900">
                  {s.title}
                </h3>
              )}
              {s.description && (
                <p className="mx-auto max-w-md text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                  {s.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {data.commitment && (
        <section className="relative overflow-hidden bg-linear-to-r from-[#05323c] to-[#0784a1] py-16 text-white sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-dots opacity-55" aria-hidden="true" />
          <div className="container-page relative mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-17 w-17 items-center justify-center rounded-[10px] bg-white shadow-lg ring-1 ring-white/40">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#0785a3] text-white">
                <Icon name="sparkle" size={25} />
              </span>
            </div>
            {data.commitment.title && (
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-[42px]">
                {data.commitment.title}
              </h2>
            )}
            {data.commitment.body && (
              <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-xs font-medium leading-relaxed text-white/90 sm:text-sm">
                {data.commitment.body}
              </p>
            )}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <CmsCtaButton
                link={data.commitment.ctaPrimary}
                variant="white"
                size="md"
                className="w-full rounded-[6px]! px-8! text-[#0785a3]! sm:w-auto"
              />
              <CmsCtaButton
                link={data.commitment.ctaSecondary}
                variant="outline"
                size="md"
                className="w-full rounded-[6px]! border-white/70! px-8! text-white! hover:bg-white/10! sm:w-auto"
              />
            </div>
          </div>
        </section>
      )}

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />
    </>
  );
}
