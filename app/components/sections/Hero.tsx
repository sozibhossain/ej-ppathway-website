import Image from "next/image";
import { CmsCtaButton } from "../ui/Button";
import type { HomeSections } from "../../lib/types";

export function Hero({ hero }: { hero: NonNullable<HomeSections["hero"]> }) {
  const title = hero.title || "";
  const highlight = hero.highlightedWord || "";
  const titleParts = highlight && title.includes(highlight) ? title.split(highlight) : null;

  const bg = hero.backgroundImage;

  return (
    <section className="relative overflow-hidden isolate">
      {/* Fallback gradient — always rendered so we never get a blank section */}
      <div
        className="absolute inset-0 bg-linear-to-br from-[#f0f9fb] via-[#eaf4f8] to-[#cfe9f0]"
        aria-hidden="true"
      />

      {/* Full-bleed background image */}
      {bg ? (
        <Image
          src={bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
          unoptimized
        />
      ) : null}

      {/* Left-anchored white overlay so the headline stays readable */}
      {bg ? (
        <div
          className="absolute inset-0 bg-linear-to-r from-white/95 via-white/75 to-transparent sm:via-white/65 lg:via-white/45 lg:to-transparent pointer-events-none"
          aria-hidden="true"
        />
      ) : null}

      <div className="container-page relative z-10 py-14 sm:py-20 md:py-28 lg:py-32 min-h-120 sm:min-h-140 lg:min-h-160 flex items-center">
        <div className="max-w-xl lg:max-w-2xl">
          {hero.badge && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {hero.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-[#0b3b4d] tracking-tight">
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className="text-[#0e7490]">{highlight}</span>
                {titleParts.slice(1).join(highlight)}
              </>
            ) : (
              title
            )}
          </h1>
          {hero.subtitle && (
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-700 max-w-xl leading-relaxed">
              {hero.subtitle}
            </p>
          )}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <CmsCtaButton
              link={hero.ctaPrimary}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            />
            <CmsCtaButton
              link={hero.ctaSecondary}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
