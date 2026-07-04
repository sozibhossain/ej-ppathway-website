import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookingActions } from "../../../components/advisor/BookingActions";
import { AdvisorCard } from "../../../components/cards/AdvisorCard";
import {
  ArrowLeftIcon,
  StarIcon,
  ChatIcon,
  PhoneIcon,
  VideoIcon,
  CalendarIcon,
} from "../../../components/ui/Icons";
import { BadgeCheck, ShieldCheck, Award, Flame, Clock } from "lucide-react";
import { api } from "../../../lib/api";
import { getSiteContent } from "../../../lib/site-content";
import type { Advisor, Review } from "../../../lib/types";

type Detail = {
  user: Advisor["user"];
  profile: Advisor["profile"];
  reviews: Review[];
  isFavorite?: boolean;
};

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RATING_BARS: Array<{ key: 5 | 4 | 3 | 2 | 1 }> = [
  { key: 5 },
  { key: 4 },
  { key: 3 },
  { key: 2 },
  { key: 1 },
];

function isAudioMediaUrl(url: string) {
  return /\.(aac|aiff|flac|m4a|mp3|ogg|opus|wav)(\?|#|$)/i.test(url);
}

export default async function AdvisorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const labels = (await getSiteContent("advisor-detail")).labels || {};
  const footer = (await getSiteContent("global")).footer || {};

  let advisor: Detail | null = null;
  try {
    const r = await api.get<Detail>(`/advisors/${id}`, undefined, { revalidate: 60, skipAuth: true });
    advisor = r.data || null;
  } catch {
    advisor = null;
  }
  if (!advisor || !advisor.user) notFound();

  const { user, profile, reviews } = advisor!;

  // Recommended / similar advisors ("You may also like").
  let recommended: Advisor[] = [];
  try {
    const rr = await api.get<Advisor[]>("/advisors/top-rated", { limit: 6 }, { revalidate: 120, skipAuth: true });
    recommended = (rr.data || []).filter((a) => a.user?._id && a.user._id !== id).slice(0, 4);
  } catch {
    recommended = [];
  }

  // Trust / credibility badges.
  const rating = profile?.avgRating || 0;
  const ratingsCount = profile?.ratingsCount || 0;
  const totalSessions = profile?.totalSessions || 0;
  const badges: Array<{ icon: React.ReactNode; label: string; cls: string }> = [];
  if (profile?.tier === "gold" || (rating >= 4.5 && ratingsCount >= 10)) {
    badges.push({ icon: <Award size={13} />, label: "Top Rated", cls: "bg-amber-100 text-amber-700" });
  }
  if (profile?.tier === "gold" || profile?.tier === "silver") {
    badges.push({ icon: <ShieldCheck size={13} />, label: "Verified Advisor", cls: "bg-[#e6f4f8] text-[#0e7490]" });
  }
  if (totalSessions >= 50) {
    badges.push({ icon: <Flame size={13} />, label: "Most Booked", cls: "bg-rose-100 text-rose-700" });
  }
  if (profile?.isOnline) {
    badges.push({ icon: <span className="h-2 w-2 rounded-full bg-emerald-500" />, label: "Available Now", cls: "bg-emerald-100 text-emerald-700" });
  }
  if (badges.length === 0) {
    badges.push({ icon: <BadgeCheck size={13} />, label: "New Advisor", cls: "bg-emerald-100 text-emerald-700" });
  }

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
          {/* Profile hero card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-linear-to-r from-[#0e7490] to-[#0c647c] px-4 sm:px-6 py-2.5 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 w-full">
              <ShieldCheck size={15} /> Verified Prophetic Pathway Advisor
            </div>
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-2xl overflow-hidden bg-slate-200 shrink-0 ring-4 ring-[#cfe9f0]">
                {user.profilePhoto ? (
                  <Image
                    src={user.profilePhoto}
                    alt={user.name || "Advisor"}
                    fill
                    className="object-cover"
                    sizes="144px"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-slate-400 text-4xl">👤</div>
                )}
                {profile?.isOnline && (
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-medium shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" /> Online
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {user.name || "Advisor"}
                </h1>
                {profile?.professionalTitle && (
                  <p className="text-slate-600 text-sm sm:text-base mt-1">{profile.professionalTitle}</p>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {badges.map((b) => (
                    <span
                      key={b.label}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${b.cls} text-xs font-semibold`}
                    >
                      {b.icon}
                      {b.label}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <StarIcon size={15} className="text-amber-500" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-slate-500">({ratingsCount} reviews)</span>
                  </span>
                  {profile?.isOnline && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <Clock size={14} /> Available now
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social proof stats */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
              <Stat value={totalSessions.toLocaleString()} label="Total Readings" />
              <Stat value={`${rating.toFixed(1)} ★`} label={`${ratingsCount} Reviews`} />
              <Stat
                value={profile?.yearsOfExperience ? `${profile.yearsOfExperience}` : "—"}
                label="Years Experience"
              />
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
                        : 0;
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
                    const pct = v > 0 ? Math.round((v / 5) * 100) : 0;
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
                {labels.introVideo || "Intro media"}
              </div>
              {isAudioMediaUrl(profile.introVideoUrl) ? (
                <div className="flex aspect-video items-center bg-slate-100 px-4">
                  <audio src={profile.introVideoUrl} controls className="w-full" />
                </div>
              ) : (
                <video
                  src={profile.introVideoUrl}
                  controls
                  className="w-full aspect-video bg-black"
                />
              )}
            </div>
          ) : null}

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div
              className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm font-medium ${
                profile?.isOnline
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  profile?.isOnline ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {profile?.isOnline ? "Available now — start instantly" : "Currently offline — book ahead"}
            </div>
            <h3 className="font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#0e7490] text-white inline-flex items-center justify-center text-xs">
                Cr
              </span>
              {labels.pricing || "Credit Pricing"}
            </h3>
            <div className="space-y-3">
              <PriceRow
                icon={<ChatIcon size={16} />}
                label="Chat"
                price={profile?.pricing?.chatPerMin}
              />
              <PriceRow
                icon={<PhoneIcon size={16} />}
                label="Call"
                price={profile?.pricing?.callPerMin}
              />
              <PriceRow
                icon={<VideoIcon size={16} />}
                label="Video"
                price={profile?.pricing?.videoPerMin}
              />
            </div>
            <BookingActions
              advisorId={id}
              appStoreLink={footer.appStoreLink}
              playStoreLink={footer.playStoreLink}
              bookLabel={labels.bookSession || "Book a session"}
              messageLabel={labels.sendMessage || "Send message"}
            />
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={13} className="text-[#0e7490]" />
              Secure booking · 100% satisfaction guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* You may also like — recommended advisors */}
      {recommended.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            You may also like
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Other trusted prophetic advisors you can connect with.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {recommended.map((a) => (
              <AdvisorCard key={a.user._id} advisor={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-3 text-center">
      <div className="text-lg sm:text-xl font-bold text-slate-900">{value}</div>
      <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function PriceRow({
  icon,
  label,
  price,
}: {
  icon: React.ReactNode;
  label: string;
  price?: number;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="inline-flex items-center gap-2 text-slate-700">
        <span className="text-[#0e7490]">{icon}</span> {label}
      </span>
      <span className="font-semibold text-slate-900">
        {(price || 0).toFixed(2)} credits/min
      </span>
    </div>
  );
}
