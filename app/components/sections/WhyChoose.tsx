import { Icon } from "../ui/Icons";
import type { CardItem } from "../../lib/types";

export function WhyChoose({
  sectionLabel,
  title,
  subtitle,
  cards,
  bgClass = "bg-white",
  centered = false
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  cards?: CardItem[];
  bgClass?: string;
  centered?: boolean;
}) {
  const items = cards || [];
  return (
    <section className={`py-12 sm:py-16 md:py-20 ${bgClass}`}>
      <div className="container-page text-center">
        {sectionLabel && (
          <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">
            + {sectionLabel}
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 max-w-3xl mx-auto leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className={`mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 ${items.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
          {items.map((c, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-[#cfe9f0] p-6 sm:p-8 transition-all hover:shadow-md hover:border-[#9ed3df] ${
                centered ? "text-center" : "bg-[#f0f9fb] text-center sm:text-left"
              }`}
              style={
                centered
                  ? { background: "linear-gradient(90deg, #E6FAFF 0%, #EFFCFF 100%)" }
                  : undefined
              }
            >
              <div
                className={`h-12 w-12 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 shadow-sm ${
                  centered ? "mx-auto" : "mx-auto sm:mx-0"
                }`}
              >
                <Icon name={c.icon} size={22} />
              </div>
              {c.title && (
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5">
                  {c.title}
                </h3>
              )}
              {c.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
