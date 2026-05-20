import Link from "next/link";
import { LockIcon, Icon } from "../../components/ui/Icons";
import { api } from "../../lib/api";
import type { CmsPage } from "../../lib/types";

type Card = { icon?: string; title: string; description?: string; bullets?: string[] };

const DEFAULT_INFO_CARD: Card = {
  icon: "shield",
  title: "Information We Collect",
  description: "We may collect:",
  bullets: [
    "Name and contact information",
    "Account credentials",
    "Session activity and booking details",
    "Payment-related information",
    "Messages and support requests",
    "Device and browser information",
  ],
};

const DEFAULT_USE_CARD: Card = {
  icon: "shield",
  title: "How We Use Your Information",
  description: "We use your information to:",
  bullets: [
    "Provide platform services",
    "Manage bookings and sessions",
    "Improve user experience",
    "Process payments",
    "Maintain security and fraud prevention",
    "Communicate important updates",
  ],
};

const DEFAULT_DETAIL_CARDS: Card[] = [
  {
    icon: "shield-check",
    title: "Privacy & Confidentiality",
    description:
      "We respect the confidentiality of all sessions and personal information. Your information is never sold to third parties.",
  },
  {
    icon: "lock",
    title: "Payment Security",
    description:
      "Payments are processed through secure third-party payment providers. We do not store sensitive payment information directly on our servers.",
  },
  {
    icon: "users",
    title: "Cookies & Analytics",
    description:
      "We may use cookies and analytics tools to improve platform performance and user experience.",
  },
  {
    icon: "heart",
    title: "Account Security",
    description: "Users are responsible for maintaining the confidentiality of their account credentials.",
  },
  {
    icon: "users",
    title: "Changes to This Policy",
    description:
      "We may update this Privacy Policy periodically. Continued use of the platform means acceptance of updated terms.",
  },
];

export default async function PrivacyPage() {
  let page: CmsPage | null = null;
  try {
    const r = await api.get<CmsPage | null>("/cms/pages/privacy_policy", undefined, {
      revalidate: 60,
      skipAuth: true,
    });
    page = r.data || null;
  } catch {
    page = null;
  }

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <section className="py-10 sm:py-14 md:py-20 bg-linear-to-b from-[#f0f9fb] to-white">
        <div className="container-page text-center max-w-3xl mx-auto">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center mb-4 sm:mb-5 shadow-md">
            <LockIcon size={26} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">
            {page?.title || "Privacy Policy"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            At Prophetic Pathway, your privacy and trust are important to us. This Privacy Policy
            explains how we collect, use, and protect your information while using our platform.
          </p>
          <p className="mt-2 text-xs text-slate-500">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {page?.content ? (
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="container-page max-w-3xl">
            <article
              className="prose prose-slate max-w-none bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-10 text-sm md:text-base leading-relaxed prose-img:rounded-xl prose-a:text-[#0e7490] prose-headings:text-slate-900"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      ) : (
        <>
          <section className="py-8 sm:py-12 bg-white">
            <div className="container-page max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <InfoCard card={DEFAULT_INFO_CARD} />
                <InfoCard card={DEFAULT_USE_CARD} />
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-12 bg-white">
            <div className="container-page max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {DEFAULT_DETAIL_CARDS.map((card, i) => (
                  <DetailCard key={i} card={card} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="py-12 sm:py-16 bg-linear-to-br from-[#082e3a] to-[#0e5d75] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="container-page text-center max-w-2xl relative">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Questions About Your Privacy?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/85 max-w-xl mx-auto">
            If you have any questions or concerns about this Privacy Policy, please contact our
            support team.
          </p>
          <div className="mt-5 sm:mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white hover:bg-slate-50 transition-colors text-[#0e7490] font-semibold shadow-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({ card }: { card: Card }) {
  return (
    <div className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{card.title}</h2>
      {card.description && <p className="text-sm text-slate-600 mb-3">{card.description}</p>}
      {card.bullets && card.bullets.length > 0 && (
        <ul className="space-y-2">
          {card.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0e7490] shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DetailCard({ card }: { card: Card }) {
  return (
    <div className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-5 sm:p-6 flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl bg-[#0e7490] text-white inline-flex items-center justify-center shrink-0 shadow-sm">
        <Icon name={card.icon} size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
        )}
      </div>
    </div>
  );
}
