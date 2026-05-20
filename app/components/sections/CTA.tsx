import { Icon } from "../ui/Icons";
import { CmsCtaButton } from "../ui/Button";
import type { LinkValue } from "../../lib/types";

export function CTA({
  title,
  subtitle,
  buttonPrimary,
  buttonSecondary,
  iconName = "calendar",
  tone = "teal"
}: {
  title?: string;
  subtitle?: string;
  buttonPrimary?: LinkValue;
  buttonSecondary?: LinkValue;
  iconName?: string;
  tone?: "teal" | "deep";
}) {
  const bg =
    tone === "deep"
      ? "bg-linear-to-br from-[#082e3a] to-[#0e5d75]"
      : "bg-linear-to-br from-[#0e7490] to-[#085a72]";
  return (
    <section className={`py-12 sm:py-16 ${bg} text-white relative overflow-hidden`}>
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="container-page text-center relative">
        <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
          <Icon name={iconName} size={26} />
        </div>
        {title && (
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
          <CmsCtaButton link={buttonPrimary} variant="white" size="lg" className="w-full sm:w-auto" />
          <CmsCtaButton
            link={buttonSecondary}
            variant="outline"
            size="lg"
            className="border-white! text-white! hover:bg-white/10! w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
