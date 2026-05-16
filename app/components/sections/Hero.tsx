import Image from "next/image";
import { CmsCtaButton } from "../ui/Button";
import type { HomeSections } from "../../lib/types";

export function Hero({ hero }: { hero: NonNullable<HomeSections["hero"]> }) {
  const title = hero.title || "";
  const highlight = hero.highlightedWord || "";
  const titleParts = highlight && title.includes(highlight) ? title.split(highlight) : null;

  return (
    <section className="relative overflow-hidden bg-[#f5fbfd]">
      <div className="container-page grid lg:grid-cols-2 gap-8 md:gap-10 items-center py-10 sm:py-12 md:py-20">
        <div className="order-2 lg:order-1">
          {hero.badge && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {hero.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] text-[#0b3b4d]">
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
          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <CmsCtaButton link={hero.ctaPrimary} variant="secondary" size="lg" className="w-full sm:w-auto" />
            <CmsCtaButton link={hero.ctaSecondary} variant="outline" size="lg" className="w-full sm:w-auto" />
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          {hero.backgroundImage ? (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={hero.backgroundImage} alt={title} fill className="object-cover" sizes="(min-width: 1024px) 600px, 100vw" unoptimized />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#cfe9f0] to-[#e7f5f8]" />
          )}
        </div>
      </div>
    </section>
  );
}
