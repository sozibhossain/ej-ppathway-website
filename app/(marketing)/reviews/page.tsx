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
      <div
        style={{
          background:
            "linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0.47) 27.84%, #D3F6FF 99.8%)",
        }}
      >
        {/* Hero */}
        <section className="pt-[72px] pb-16 sm:pt-[88px] sm:pb-20 md:pt-24 md:pb-24">
          <div className="container-page text-center max-w-3xl mx-auto">
            <div className="mx-auto h-[52px] w-[52px] sm:h-[60px] sm:w-[60px] rounded-xl bg-[#0b86a1] text-white inline-flex items-center justify-center mb-5 shadow-[0_8px_20px_rgba(14,116,144,0.22)] ring-4 ring-white/70">
              <Icon name="shield-check" size={28} />
            </div>
            {hero.title && (
              <h1 className="text-[2.25rem] sm:text-5xl md:text-[4.25rem] font-extrabold text-[#087895] leading-[1.08] tracking-normal">
                {hero.title}
              </h1>
            )}
            {hero.subtitle && (
              <p className="mt-5 text-sm sm:text-base text-slate-700 leading-snug max-w-2xl mx-auto font-medium">
                {hero.subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Commitment cards */}
        {data.commitment && (
          <section className="pb-[72px] sm:pb-[88px] md:pb-24">
          <div className="container-page text-center">
            {data.commitment.title && (
              <h2 className="text-[2rem] sm:text-4xl md:text-[3.45rem] font-extrabold text-[#087895] mb-9 sm:mb-12 leading-tight">
                {data.commitment.title}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto">
              {(data.commitment.cards || []).map((c, i) => (
                <div
                  key={i}
                  className="bg-[#eafaff] border-2 border-[#83d1df] rounded-2xl p-4 sm:p-5 text-left shadow-[0_3px_12px_rgba(8,120,149,0.06)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-[#078aa4] text-white inline-flex items-center justify-center shrink-0 shadow-sm">
                      <Icon name={c.icon} size={21} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {c.title && (
                        <h3 className="font-extrabold text-slate-800 text-lg leading-tight mb-1">{c.title}</h3>
                      )}
                      {c.description && (
                        <p className="text-sm text-slate-600 mb-4 leading-snug">{c.description}</p>
                      )}
                      <ul className="space-y-2">
                        {(c.bullets || []).map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-start gap-2.5 text-sm font-medium text-slate-800"
                          >
                            <span className="mt-0.5 h-4 w-4 rounded-full bg-[#078aa4] text-white inline-flex items-center justify-center shrink-0">
                              <CheckIcon size={10} strokeWidth={2.4} />
                            </span>
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
      </div>

      {/* Trusted by Thousands */}
      {data.trustedByThousands && (
        <section className="py-14 sm:py-16 bg-linear-to-r from-[#083e4a] via-[#075f73] to-[#078aa4] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-55 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center relative">
            {data.trustedByThousands.title && (
              <h2 className="text-2xl sm:text-3xl md:text-[2.6rem] font-extrabold mb-6 sm:mb-8 leading-tight">
                {data.trustedByThousands.title}
              </h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 max-w-3xl mx-auto">
              {(data.trustedByThousands.stats || []).map((s, i) => (
                <div key={i}>
                  <div className="text-2xl sm:text-3xl md:text-[2rem] font-extrabold">{s.value}</div>
                  <div className="text-xs md:text-sm text-white/75 mt-2 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fair resolution */}
      {data.fairResolution && (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="container-page max-w-4xl text-center">
            {data.fairResolution.title && (
              <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-slate-950 leading-tight">
                {data.fairResolution.title}
              </h2>
            )}
            {data.fairResolution.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium">
                {data.fairResolution.subtitle}
              </p>
            )}

            <div className="mt-8 sm:mt-10 rounded-2xl bg-[#eafaff] border-2 border-[#83d1df] p-5 sm:p-6 text-left space-y-5 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
              {(data.fairResolution.steps || []).map((s, i) => (
                <div key={i} className="flex gap-4">
                  <span className="h-8 w-8 rounded-md bg-[#078aa4] text-white font-extrabold text-sm inline-flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {s.title && (
                      <div className="font-extrabold text-slate-900 text-lg leading-tight">{s.title}</div>
                    )}
                    {s.description && (
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                        {s.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {data.fairResolution.importantNote && (
                <div className="rounded-xl bg-[#d9f6fd] border border-[#83d1df] p-4 text-sm text-slate-700 mt-4 flex items-start gap-2">
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
        <section className="py-16 sm:py-20 bg-linear-to-r from-[#083e4a] via-[#075f73] to-[#078aa4] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-55 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center max-w-3xl relative">
            <div className="mx-auto h-[52px] w-[52px] sm:h-[60px] sm:w-[60px] rounded-xl bg-white text-[#078aa4] inline-flex items-center justify-center mb-5 shadow-lg">
              <ChatIcon size={26} />
            </div>
            {data.contactBlock.title && (
              <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold leading-tight">
                {data.contactBlock.title}
              </h2>
            )}
            {data.contactBlock.subtitle && (
              <p className="mt-4 text-sm sm:text-base text-white/85 font-medium max-w-2xl mx-auto">
                {data.contactBlock.subtitle}
              </p>
            )}
            <div className="mt-6">
              <CmsCtaButton link={data.contactBlock.ctaPrimary} variant="white" size="md" />
            </div>
            <div className="mt-4 text-xs text-white/80 wrap-break-word">
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
