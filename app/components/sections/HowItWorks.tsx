import { Icon } from "../ui/Icons";
import type { Step } from "../../lib/types";

export function HowItWorks({
  sectionLabel,
  title,
  subtitle,
  steps,
  numbered = false,
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  steps?: Step[];
  numbered?: boolean;
}) {
  const items = steps || [];
  const count = items.length || 1;

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="container-page text-center">
        {sectionLabel && (
          <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">
            + {sectionLabel}
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        )}

        <div className={`mt-10 sm:mt-12 relative ${numbered ? "w-full" : "max-w-6xl mx-auto"}`}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-y-10 sm:gap-y-12 lg:gap-y-0 ${
              count >= 5
                ? "lg:grid-cols-5"
                : count === 4
                  ? "lg:grid-cols-4"
                  : count === 3
                    ? "lg:grid-cols-3"
                    : "lg:grid-cols-2"
            }`}
          >
            {items.map((s, i) => {
              const isLast = i === items.length - 1;
              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center px-4"
                >
                  {/* Dashed connector to the next step (lg+ only) */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={`hidden lg:flex absolute ${numbered ? "top-8" : "top-7"} left-1/2 right-[-50%] items-center pl-10 pr-10 z-0`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0e7490]" />
                      <span className="flex-1 border-t-2 border-dashed border-[#0e7490]/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0e7490]" />
                    </div>
                  )}

                  <div
                    className={`relative z-10 rounded-full bg-[#0e7490] text-white inline-flex flex-col items-center justify-center mb-4 shadow-lg shadow-[#0e7490]/25 ${
                      numbered ? "h-16 w-16" : "h-14 w-14 sm:h-16 sm:w-16"
                    }`}
                  >
                    <Icon name={s.icon} size={numbered ? 20 : 26} />
                    {numbered && (
                      <span className="text-[10px] leading-none font-semibold mt-0.5">
                        Step {i + 1}
                      </span>
                    )}
                  </div>

                  {s.title && (
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      {s.title}
                    </h3>
                  )}
                  {s.description && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-65 mx-auto">
                      {s.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
