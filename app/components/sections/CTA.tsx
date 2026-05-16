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
      ? "bg-gradient-to-br from-[#082e3a] to-[#0e5d75]"
      : "bg-gradient-to-br from-[#0e7490] to-[#085a72]";
  return (
    <section className={`py-16 ${bg} text-white`}>
      <div className="container-page text-center">
        <div className="mx-auto h-14 w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-5">
          <Icon name={iconName} size={26} />
        </div>
        {title && <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>}
        {subtitle && <p className="mt-2 text-white/85 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <CmsCtaButton link={buttonPrimary} variant="white" size="lg" />
          <CmsCtaButton link={buttonSecondary} variant="outline" size="lg" className="!border-white !text-white hover:!bg-white/10" />
        </div>
      </div>
    </section>
  );
}
