import Link from "next/link";
import { CmsCtaButton } from "../../components/ui/Button";
import { Icon, CheckIcon, ChatIcon } from "../../components/ui/Icons";
import { Testimonials } from "../../components/sections/Testimonials";
import { FAQSection } from "../../components/sections/FAQSection";
import { getSiteContent } from "../../lib/site-content";

export default async function ReviewsPage() {
  const data = await getSiteContent("reviews");
  const hero = data.hero || {};

  return (
    <>
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 sm:mb-5 shadow-md">
            <Icon name="shield-check" size={26} />
          </div>
          {hero.title && (
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {hero.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Commitment cards */}
      {data.commitment && (
        <section className="py-10 sm:py-14 bg-white">
          <div className="container-page text-center">
            {data.commitment.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0e7490] mb-8 sm:mb-10">
                {data.commitment.title}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto">
              {(data.commitment.cards || []).map((c, i) => (
                <div
                  key={i}
                  className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-4 sm:p-6 text-left hover:border-[#9ed3df] hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center shrink-0 shadow-sm">
                      <Icon name={c.icon} size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {c.title && (
                        <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
                      )}
                      {c.description && (
                        <p className="text-sm text-slate-600 mb-3">{c.description}</p>
                      )}
                      <ul className="space-y-1.5">
                        {(c.bullets || []).map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <CheckIcon
                              size={14}
                              className="mt-0.5 text-emerald-500 shrink-0"
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trusted by Thousands */}
      {data.trustedByThousands && (
        <section className="py-10 sm:py-14 bg-linear-to-br from-[#0e7490] to-[#06495d] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center relative">
            {data.trustedByThousands.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6">
                {data.trustedByThousands.title}
              </h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {(data.trustedByThousands.stats || []).map((s, i) => (
                <div key={i}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{s.value}</div>
                  <div className="text-xs md:text-sm text-white/80 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fair resolution */}
      {data.fairResolution && (
        <section className="py-10 sm:py-14 bg-white">
          <div className="container-page max-w-3xl text-center">
            {data.fairResolution.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                {data.fairResolution.title}
              </h2>
            )}
            {data.fairResolution.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                {data.fairResolution.subtitle}
              </p>
            )}

            <div className="mt-8 sm:mt-10 rounded-2xl bg-[#e6f4f8] border border-[#cfe9f0] p-4 sm:p-6 text-left space-y-4">
              {(data.fairResolution.steps || []).map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="h-7 w-7 rounded-full bg-[#0e7490] text-white font-semibold text-sm inline-flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {s.title && (
                      <div className="font-semibold text-slate-900">{s.title}</div>
                    )}
                    {s.description && (
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {s.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {data.fairResolution.importantNote && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-slate-700 mt-4 flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 text-base">ⓘ</span>
                  <div>
                    <div className="font-semibold text-amber-700 mb-1">Important to Note:</div>
                    <p className="leading-relaxed">{data.fairResolution.importantNote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Testimonials
        sectionLabel={data.testimonialsHeader?.eyebrow}
        title={data.testimonialsHeader?.title}
        subtitle={data.testimonialsHeader?.subtitle}
        trustpilotRating={data.testimonialsHeader?.trustpilotRating}
        totalReviews={data.testimonialsHeader?.totalReviews}
      />

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />

      {data.contactBlock && (
        <section className="py-10 sm:py-14 bg-linear-to-br from-[#082e3a] to-[#0e5d75] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center max-w-3xl relative">
            <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
              <ChatIcon size={26} />
            </div>
            {data.contactBlock.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {data.contactBlock.title}
              </h2>
            )}
            {data.contactBlock.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-white/85">
                {data.contactBlock.subtitle}
              </p>
            )}
            <div className="mt-5">
              <CmsCtaButton link={data.contactBlock.ctaPrimary} variant="white" size="md" />
            </div>
            <div className="mt-3 text-xs text-white/80 wrap-break-word">
              {data.contactBlock.contactEmail && (
                <>
                  Email:{" "}
                  <Link
                    href={`mailto:${data.contactBlock.contactEmail}`}
                    className="underline"
                  >
                    {data.contactBlock.contactEmail}
                  </Link>
                </>
              )}
              {data.contactBlock.contactPhone && (
                <>
                  {" "}
                  | Phone:{" "}
                  <Link
                    href={`tel:${data.contactBlock.contactPhone}`}
                    className="underline"
                  >
                    {data.contactBlock.contactPhone}
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
