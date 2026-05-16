import { Icon } from "../ui/Icons";
import type { Step } from "../../lib/types";

export function HowItWorks({
  sectionLabel,
  title,
  subtitle,
  steps
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  steps?: Step[];
}) {
  const items = steps || [];
  return (
    <section className="py-16 md:py-20">
      <div className="container-page text-center">
        {sectionLabel && <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">+ {sectionLabel}</div>}
        {title && <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>}
        {subtitle && <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}

        <div className="mt-12 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-[#0e7490]/30" />
          {items.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center px-2">
              <div className="relative z-10 h-16 w-16 rounded-2xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 shadow-lg shadow-[#0e7490]/25">
                <Icon name={s.icon} size={28} />
              </div>
              {s.title && <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>}
              {s.description && <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
