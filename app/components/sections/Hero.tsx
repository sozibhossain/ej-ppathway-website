import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { HomeSections } from "../../lib/types";

export function Hero({ hero }: { hero: NonNullable<HomeSections["hero"]> }) {
  const title = hero.title || "";
  const highlight = hero.highlightedWord || "";
  const titleParts = highlight && title.includes(highlight) ? title.split(highlight) : null;
  const bg = hero.backgroundImage;

  return (
    <section className="relative overflow-hidden isolate">
      <div className="absolute inset-0 bg-[#f0f9fb]" aria-hidden="true" />

      {bg && (
        <Image
          src={bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
          unoptimized
        />
      )}

      {bg && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, rgba(255,255,255,0) 38.65%, rgba(255,255,255,0.871488) 63.3%, #FFFFFF 100%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="container-page relative z-10 py-9 sm:py-12 md:py-16 lg:py-20 min-h-96 sm:min-h-120 lg:min-h-140 flex items-center">
        <div className="max-w-xl lg:max-w-2xl">
          {hero.badge && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 font-medium mb-5 sm:mb-7">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {hero.badge}
            </span>
          )}

          <h1
            className="font-bold text-[#0b3b4d]"
            style={{
              fontFamily: "var(--font-outfit), Outfit, sans-serif",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1,
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            {titleParts ? (
              <>
                {titleParts[0]}
                <span style={{ color: "#0e7490" }}>{highlight}</span>
                {titleParts.slice(1).join(highlight)}
              </>
            ) : (
              title
            )}
          </h1>

          {hero.subtitle && (
            <p
              className="mt-4 sm:mt-5 text-slate-700 max-w-xl"
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

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {hero.ctaPrimary?.label && (
              <HeroButton href={hero.ctaPrimary.href || "#"} variant="primary">
                {hero.ctaPrimary.label}
              </HeroButton>
            )}
            {hero.ctaSecondary?.label && (
              <HeroButton href={hero.ctaSecondary.href || "#"} variant="outline">
                {hero.ctaSecondary.label}
              </HeroButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroButton({
  href,
  children,
  variant,
}: {
  href: string;
  children: ReactNode;
  variant: "primary" | "outline";
}) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    height: "52px",
    padding: "16px 32px",
    fontSize: "16px",
    fontFamily: "var(--font-outfit), Outfit, sans-serif",
    fontWeight: 600,
    gap: "8px",
    transition: "background-color 0.2s, border-color 0.2s",
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  const variantStyle: CSSProperties =
    variant === "primary"
      ? { background: "#027B98", color: "#FFFFFF", border: "none" }
      : { background: "#FFFFFF", color: "#027B98", border: "1.5px solid #027B98" };

  const style = { ...base, ...variantStyle };

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}
