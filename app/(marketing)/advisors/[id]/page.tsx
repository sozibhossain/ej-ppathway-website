import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import {
  ArrowLeftIcon,
  StarIcon,
  ChatIcon,
  PhoneIcon,
  VideoIcon,
  CalendarIcon,
} from "../../../components/ui/Icons";
import { MapPin } from "lucide-react";
import { api } from "../../../lib/api";
import { getSiteContent } from "../../../lib/site-content";
import {
  fetchCountries,
  countryNameFrom,
  currencyCodeFrom,
  formatLocation,
} from "../../../lib/countries-data";
import { fetchCurrencyCatalog, symbolFrom } from "../../../lib/currency-data";
import type { Advisor, Review } from "../../../lib/types";

type Detail = {
  user: Advisor["user"];
  profile: Advisor["profile"];
  reviews: Review[];
  isFavorite?: boolean;
};

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RATING_BARS: Array<{ key: 5 | 4 | 3 | 2 | 1; defaultPct: number }> = [
  { key: 5, defaultPct: 89 },
  { key: 4, defaultPct: 8 },
  { key: 3, defaultPct: 2 },
  { key: 2, defaultPct: 1 },
  { key: 1, defaultPct: 0 },
];

export default async function AdvisorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const labels = (await getSiteContent("advisor-detail")).labels || {};

  let advisor: Detail | null = null;
  try {
    const r = await api.get<Detail>(`/advisors/${id}`, undefined, { revalidate: 60, skipAuth: true });
    advisor = r.data || null;
  } catch {
    advisor = null;
  }
  if (!advisor || !advisor.user) notFound();

  const { user, profile, reviews } = advisor!;
  const countries = await fetchCountries();
  const userLocation = formatLocation(
    user.city,
    countryNameFrom(countries, user.country),
  );
  const catalog = await fetchCurrencyCatalog();
  // Symbol follows the advisor's selected country (fall back to stored currency).
  const currencySymbol = symbolFrom(
    catalog,
    currencyCodeFrom(countries, user.country) || user.currency,
  );
  const tierLabel =
    profile?.tier === "gold"
      ? "Gold Advisor"
      : profile?.tier === "silver"
        ? "Silver Advisor"
        : "New Advisor";
  const tierClass =
    profile?.tier === "gold"
      ? "bg-amber-100 text-amber-700"
      : profile?.tier === "silver"
        ? "bg-slate-100 text-slate-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <div className="container-page py-6 sm:py-8">
      <Link
        href="/advisors"
        className="inline-flex items-center gap-2 mb-6 text-slate-700 hover:text-[#0e7490] bg-white px-4 py-2 rounded-full border border-slate-200 text-sm transition-colors"
      >
        <ArrowLeftIcon size={16} /> {labels.goBack || "Go Back"}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 sm:gap-6">
        <div className="space-y-4 sm:space-y-5">
          {/* Profile header card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-2 ring-[#cfe9f0]">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={user.name || "Advisor"}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user.name || "Advisor"}
              </h1>
              {profile?.professionalTitle && (
                <p className="text-slate-600 text-sm mt-0.5">{profile.professionalTitle}</p>
              )}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${tierClass} text-xs font-semibold`}
                >
                  ★ {tierLabel}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} className="text-slate-400" />
                  {userLocation || "Worldwide"}
                </span>
                {profile?.avgRating ? (
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <StarIcon size={14} className="text-amber-500" />
                    <span className="font-semibold">{profile.avgRating.toFixed(1)}</span>
                    <span className="text-slate-500">({profile.ratingsCount || 0} reviews)</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {profile?.bio && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                {labels.aboutMe || "About me"}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Expertise */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {labels.expertiseCategories || "Expertise & Categories"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">
                  {labels.skills || "Skills/Expertise"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile?.expertise || []).map((e) => (
                    <span
                      key={e}
                      className="px-3 py-1.5 rounded-md bg-[#e6f4f8] text-[#0e7490] text-xs font-medium"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">
                  {labels.styles || "Styles"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile?.styles || []).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-md bg-[#e6f4f8] text-[#0e7490] text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">
                  {labels.languages || "Languages"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile?.languages || []).map((l) => (
                    <span
                      key={l}
                      className="px-3 py-1.5 rounded-md bg-[#e6f4f8] text-[#0e7490] text-xs font-medium"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly schedule */}
          {profile?.weeklySchedule && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#0e7490]" />
                {labels.weeklySchedule || "Weekly Schedule"}
              </h2>
              <ul className="divide-y divide-slate-100">
                {DAY_KEYS.map((key, i) => {
                  const day = profile.weeklySchedule?.[key];
                  return (
                    <li key={key} className="flex items-center justify-between py-3">
                      <span className="text-slate-800 text-sm">{DAY_LABELS[i]}</span>
                      <span className="text-[#0e7490] font-medium text-sm">
                        {day?.enabled === false
                          ? "Closed"
                          : `${day?.from || "09:00"} - ${day?.to || "17:00"}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {labels.reviewsAndRatings || "Reviews & Ratings"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
              <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                <div className="text-sm text-slate-600 mb-1">
                  {labels.averageRating || "Average Rating"}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 inline-flex items-center gap-2">
                  {(profile?.avgRating || 0).toFixed(1)}{" "}
                  <StarIcon size={20} className="text-amber-500" />
                </div>
                <div className="text-xs text-slate-500 mt-1 mb-4">
                  Based on {profile?.ratingsCount || 0} reviews
                </div>
                <div className="space-y-1.5">
                  {RATING_BARS.map((b) => {
                    const breakdown = profile?.ratingBreakdown?.[String(b.key)];
                    const pct =
                      typeof breakdown === "number"
                        ? Math.round((breakdown / Math.max(1, profile?.ratingsCount || 1)) * 100)
                        : b.defaultPct;
                    return (
                      <div key={b.key} className="flex items-center gap-2 text-xs">
                        <span className="w-5 inline-flex items-center gap-0.5 text-slate-700 shrink-0">
                          {b.key}
                          <StarIcon size={10} className="text-amber-500" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#0e7490]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-slate-700 font-semibold w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                <div className="text-sm text-slate-600 mb-3">
                  {labels.performanceHighlights || "Performance Highlights"}
                </div>
                {(["communication", "expertise", "professionalism", "valueForMoney"] as const).map(
                  (k) => {
                    const v = profile?.ratingBreakdown?.[k] || 0;
                    const pct = v > 0 ? Math.round((v / 5) * 100) : 95 + Math.floor(Math.random() * 5);
                    const label =
                      k === "valueForMoney"
                        ? "Value for Money"
                        : k.charAt(0).toUpperCase() + k.slice(1);
                    return (
                      <div key={k} className="flex items-center gap-2 mb-2 last:mb-0">
                        <span className="text-xs text-slate-600 w-32 shrink-0">{label}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#0e7490]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-10 text-right">
                          {pct}%
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="space-y-3">
              {reviews.slice(0, 6).map((r) => (
                <div key={r._id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3 mb-2">
                    {r.user?.profilePhoto ? (
                      <Image
                        src={r.user.profilePhoto}
                        alt={r.user.name || ""}
                        width={36}
                        height={36}
                        className="rounded-md object-cover h-9 w-9"
                        unoptimized
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-md bg-slate-200" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-sm">
                        {r.user?.name || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <StarIcon key={i} size={11} />
                          ))}
                        </span>
                        {r.sessionType && (
                          <span className="capitalize">{r.sessionType} Session</span>
                        )}
                        <span>·</span>
                        <span>
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{r.comment || "—"}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {profile?.introVideoUrl ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="text-center px-4 py-3 text-slate-800 font-semibold border-b border-slate-100">
                {labels.introVideo || "Intro video"}
              </div>
              <video
                src={profile.introVideoUrl}
                controls
                className="w-full aspect-video bg-black"
              />
            </div>
          ) : null}

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#0e7490] text-white inline-flex items-center justify-center text-xs">
                {currencySymbol}
              </span>
              {labels.pricing || "Pricing"}
            </h3>
            <div className="space-y-3">
              <PriceRow
                icon={<ChatIcon size={16} />}
                label="Chat"
                price={profile?.pricing?.chatPerMin}
                symbol={currencySymbol}
              />
              <PriceRow
                icon={<PhoneIcon size={16} />}
                label="Call"
                price={profile?.pricing?.callPerMin}
                symbol={currencySymbol}
              />
              <PriceRow
                icon={<VideoIcon size={16} />}
                label="Video"
                price={profile?.pricing?.videoPerMin}
                symbol={currencySymbol}
              />
            </div>
            <div className="mt-5 space-y-2">
              <Button size="md" className="w-full">
                {labels.bookSession || "Book a session"}
              </Button>
              <button
                type="button"
                className="w-full h-11 rounded-full bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors"
              >
                {labels.sendMessage || "Send message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({
  icon,
  label,
  price,
  symbol = "$",
}: {
  icon: React.ReactNode;
  label: string;
  price?: number;
  symbol?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="inline-flex items-center gap-2 text-slate-700">
        <span className="text-[#0e7490]">{icon}</span> {label}
      </span>
      <span className="font-semibold text-slate-900">
        {symbol}
        {(price || 0).toFixed(2)}/min
      </span>
    </div>
  );
}
