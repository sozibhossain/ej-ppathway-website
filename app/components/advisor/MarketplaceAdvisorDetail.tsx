"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AdvisorAvailabilityPanel } from "./AdvisorAvailabilityPanel";
import { ChatIcon, PhoneIcon, StarIcon, VideoIcon } from "../ui/Icons";
import type { Advisor, AdvisorDetailSections, GlobalSections, Review } from "../../lib/types";

type Detail = {
  user: Advisor["user"];
  profile: Advisor["profile"];
  reviews: Review[];
  isFavorite?: boolean;
};

type Props = {
  advisor: Detail;
  recommended: Advisor[];
  advisorId: string;
  labels: NonNullable<AdvisorDetailSections["labels"]>;
  footer: NonNullable<GlobalSections["footer"]>;
};

type ScheduleDay = NonNullable<Advisor["profile"]["weeklySchedule"]>[string];

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
const STARS = [1, 2, 3, 4, 5];
type ReviewFilter = "recent" | "call" | "chat" | "video";

export function MarketplaceAdvisorDetail({ advisor, recommended, advisorId, labels, footer }: Props) {
  const { user, profile, reviews } = advisor;
  const [mediaModal, setMediaModal] = useState<{ url: string; title: string; type: "audio" | "video" } | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("recent");
  const advisorName = displayName(user.name);
  const rating = profile.avgRating || 0;
  const ratingsCount = profile.ratingsCount || 0;
  const reviewCountLabel = formatReviewCount(ratingsCount);
  const totalReadings = profile.totalSessions || 0;
  const todaysRange = todaysDisplayRange(profile.weeklySchedule);
  const paragraphs = profileParagraphs(profile);
  const endorsements = endorsementRows(profile, ratingsCount);
  const audioMessageUrl =
    profile.audioMessageUrl || (profile.introVideoUrl && isAudioMediaUrl(profile.introVideoUrl) ? profile.introVideoUrl : "");
  const introVideoUrl = profile.introVideoUrl && !isAudioMediaUrl(profile.introVideoUrl) ? profile.introVideoUrl : "";
  const filteredReviews = useMemo(() => filterAndSortReviews(reviews, reviewFilter), [reviews, reviewFilter]);
  const totalReviewPages = Math.ceil(filteredReviews.length / 5);

  useEffect(() => {
    console.log("Marketplace advisor reviews:", reviews);
    console.log("Filtered marketplace advisor reviews:", {
      filter: reviewFilter,
      reviews: filteredReviews,
    });
  }, [reviews, reviewFilter, filteredReviews]);


  return (
    <main className="bg-white text-[#152238]">
      <div className="container-page px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <nav className="mb-6 text-sm sm:text-base">
          <Link href="/advisors" className="font-semibold text-[#b12626] underline underline-offset-2">
            Our Advisors
          </Link>
          <span className="mx-2 text-slate-500">/</span>
          <span className="font-semibold text-slate-900">{advisorName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,760px)_400px] gap-5 lg:gap-8 items-start">
          <div className="min-w-0">
          <section className="rounded border border-[#d6d6d6] bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6">
              <div className="relative h-[260px] w-full max-w-[260px] overflow-hidden rounded bg-slate-100 border border-slate-200">
                {user.profilePhoto ? (
                  <Image
                    src={user.profilePhoto}
                    alt={advisorName}
                    fill
                    className="object-cover"
                    sizes="260px"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-slate-100 text-5xl text-slate-300">
                    PP
                  </div>
                )}
                {/* <span className="absolute right-4 top-4 text-4xl leading-none text-white drop-shadow">{"\u2661"}</span> */}
                {profile.isOnline ? (
                  <span className="absolute bottom-3 left-3 rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                    Online
                  </span>
                ) : null}
              </div>

              <div className="min-w-0 pt-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#a92828]">
                  {profile.professionalTitle || advisorName}
                </h1>
                {profile.professionalTitle && user.name ? (
                  <p className="mt-2 text-lg font-medium text-slate-900">{advisorName}</p>
                ) : null}
                <div className="mt-4 flex items-center gap-2">
                  {StarRating(rating, 22)}
                  <span className="text-sm font-semibold text-slate-500">
                    {ratingsCount ? `${rating.toFixed(1)} (${reviewCountLabel})` : "No reviews yet"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {audioMessageUrl ? (
                    <button
                      type="button"
                      onClick={() => setMediaModal({ url: audioMessageUrl, title: "Listen to Message", type: "audio" })}
                      className="inline-flex items-center gap-2 text-base font-semibold text-[#1f6f91] hover:underline"
                    >
                      Listen to message
                    </button>
                  ) : null}
                  {introVideoUrl ? (
                    <button
                      type="button"
                      onClick={() => setMediaModal({ url: introVideoUrl, title: labels.introVideo || "Intro Video", type: "video" })}
                      className="inline-flex items-center gap-2 text-base font-semibold text-[#1f6f91] hover:underline"
                    >
                      Watch intro video
                    </button>
                  ) : null}
                </div>

                <p className={`mt-6 text-lg font-bold ${profile.isOnline ? "text-[#4b861b]" : "text-[#a92828]"}`}>
                  {profile.isOnline
                    ? `I'm available${todaysRange !== "Closed" ? ` - until ${todaysRange.split(" - ").pop()}` : " now"}`
                    : "Currently offline - appointments available"}
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ActionRate label="Call Me" icon={<PhoneIcon size={18} />} price={profile.pricing?.callPerMin} />
                  <ActionRate label="Chat" icon={<ChatIcon size={18} />} price={profile.pricing?.chatPerMin} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  <SmallService label="Video" icon={<VideoIcon size={16} />} price={profile.pricing?.videoPerMin} />
                </div>
              </div>
            </div>
          </section>

          {audioMessageUrl ? (
            <MediaPanel
              url={audioMessageUrl}
              title="Listen to Message"
              type="audio"
              onOpen={() => setMediaModal({ url: audioMessageUrl, title: "Listen to Message", type: "audio" })}
            />
          ) : null}

          {introVideoUrl ? (
            <MediaPanel
              url={introVideoUrl}
              title={labels.introVideo || "Intro Video"}
              type="video"
              onOpen={() => setMediaModal({ url: introVideoUrl, title: labels.introVideo || "Intro Video", type: "video" })}
            />
          ) : null}

        <section className="mt-4 max-w-[760px]">
          <h2 className="mb-5 text-xl font-bold text-slate-950">About {advisorName}</h2>
          <InfoLine label="Total Readings" value={totalReadings ? totalReadings.toLocaleString() : "New advisor"} />
          <InfoLine label="Specialties" value={formatList(profile.expertise) || "Spiritual guidance"} />
          <InfoLine label="Tools" value={formatList(profile.styles) || "Intuitive guidance"} />
          <InfoLine label="Reading Style" value={formatList((profile.styles || []).slice(0, 2)) || "Compassionate"} />
        </section>

        <SectionDivider />

        <section className="max-w-[760px]">
          <h2 className="mb-4 text-lg font-bold text-[#a92828]">Customer Endorsements</h2>
          {endorsements.length ? (
            <ul className="ml-6 list-disc space-y-1 text-base leading-7">
              {endorsements.map(({ label, count }) => (
                <li key={label}>
                  {label} - {count.toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-slate-600">No customer endorsements yet.</p>
          )}
        </section>

        <SectionDivider />

        <section className="max-w-[760px]">
          <h2 className="mb-4 text-lg font-bold text-[#a92828]">More About {advisorName}</h2>
          {profile.yearsOfExperience ? (
            <p className="mb-4 font-bold">Years of Experience: {profile.yearsOfExperience}</p>
          ) : null}
          <div className="space-y-4 text-base leading-7 text-slate-900">
            {(paragraphs.length ? paragraphs : ["This advisor has not added a full biography yet."]).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <SectionDivider />

        <section className="max-w-[760px]">
          <h2 className="mb-3 text-lg font-bold text-slate-950">
            {advisorName} Ratings & Reviews
          </h2>
          <div className="rounded border border-[#d6d6d6] bg-[#f8f8f8] px-4 py-4">
            <div>{StarRating(rating, 21)}</div>
            <p className="mt-1 font-semibold">{ratingsCount ? reviewCountLabel : "No reviews yet"}</p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-bold">Sort By</span>
            <select
              value={reviewFilter}
              onChange={(event) => setReviewFilter(event.target.value as ReviewFilter)}
              className="rounded border border-[#cfcfcf] bg-white px-4 py-2 font-semibold text-slate-950"
              aria-label="Filter reviews"
            >
              <option value="recent">Most Recent</option>
              <option value="call">Phone Reviews</option>
              <option value="chat">Chat Reviews</option>
              <option value="video">Video Reviews</option>
            </select>
          </div>

          <div className="mt-3 border-t border-[#cfd8dc]">
            {filteredReviews.length ? (
              filteredReviews.slice(0, 6).map((review, index) => (
                <ReviewRow key={review._id} review={review} featured={index === 0} />
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">{emptyReviewsText(reviewFilter)}</p>
            )}
          </div>

          {totalReviewPages > 1 ? (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex overflow-hidden rounded border border-[#d7d7d7] text-sm">
                {reviewPaginationItems(totalReviewPages).map((item) => (
                  <span key={item} className="border-r border-[#d7d7d7] px-4 py-2 last:border-r-0">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {recommended.length > 0 ? (
          <>
            <SectionDivider />
            <section className="">
              <h2 className="mb-5 text-left text-base font-bold">You may also like...</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recommended.map((item) => (
                  <MiniAdvisor key={item.user._id} advisor={item} />
                ))}
              </div>
            </section>
          </>
        ) : null}
          </div>

          <aside className="lg:sticky lg:top-24">
            <AdvisorAvailabilityPanel
              advisorId={advisorId}
              profile={profile}
              labels={labels}
              footer={footer}
            />
          </aside>
        </div>
      </div>
      {mediaModal ? (
        <MediaModal
          url={mediaModal.url}
          title={mediaModal.title}
          type={mediaModal.type}
          onClose={() => setMediaModal(null)}
        />
      ) : null}
    </main>
  );
}

function isAudioMediaUrl(url: string) {
  return /\.(aac|aiff|flac|m4a|mp3|ogg|opus|wav)(\?|#|$)/i.test(url);
}

function displayPrice(value?: number) {
  return `${(value || 0).toFixed(2)} credits/min`;
}

function displayName(name?: string) {
  return name?.trim() || "Advisor";
}

function formatList(items?: string[]) {
  return (items || [])
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function displayRange(day?: ScheduleDay) {
  if (!day || day.enabled === false) return "Closed";
  return scheduleRanges(day)
    .map((slot) => `${slot.from} - ${slot.to}`)
    .join(", ") || "Closed";
}

function todaysDisplayRange(schedule?: Advisor["profile"]["weeklySchedule"]) {
  if (!schedule) return "Book an appointment";
  const today = DAY_KEYS[new Date().getDay()];
  return displayRange(schedule[today]);
}

function scheduleRanges(day?: ScheduleDay) {
  if (!day || day.enabled === false) return [];
  const slots = day.slots?.length ? day.slots : [{ from: day.from, to: day.to }];
  return slots.map((slot) => ({
    from: slot.from || "09:00",
    to: slot.to || "17:00",
  }));
}

function endorsementRows(profile: Advisor["profile"], ratingsCount: number) {
  if (!ratingsCount) return [];
  return (profile.expertise || [])
    .map((label) => label.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((label, index) => ({
      label,
      count: Math.max(1, Math.round(ratingsCount / (index + 1))),
    }));
}

function profileParagraphs(profile: Advisor["profile"]) {
  const text = profile.detailedDescription || profile.bio || "";
  return text
    .split(/\n{2,}|\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function StarRating(rating: number, size = 17) {
  return (
    <span className="inline-flex text-orange-400" aria-label={`${rating} stars`}>
      {STARS.map((n) => (
        <StarIcon
          key={n}
          size={size}
          className={n <= Math.round(rating) ? "fill-orange-300" : "text-slate-300"}
        />
      ))}
    </span>
  );
}

function formatReviewCount(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? "review" : "reviews"}`;
}

function filterAndSortReviews(reviews: Review[], filter: ReviewFilter) {
  return [...reviews]
    .filter((review) => filter === "recent" || review.sessionType === filter)
    .sort((a, b) => reviewTimestamp(b.createdAt) - reviewTimestamp(a.createdAt));
}

function reviewTimestamp(value?: string) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function emptyReviewsText(filter: ReviewFilter) {
  if (filter === "call") return "No phone reviews yet.";
  if (filter === "chat") return "No chat reviews yet.";
  if (filter === "video") return "No video reviews yet.";
  return "No reviews yet.";
}

function reviewPaginationItems(totalPages: number) {
  if (totalPages <= 1) return [];
  if (totalPages <= 5) return ["<<", ...Array.from({ length: totalPages }, (_, index) => String(index + 1)), ">>"];
  return ["<<", "1", "2", "3", "...", String(totalPages), ">>"];
}

function MediaPanel({
  url,
  title,
  type,
  onOpen,
}: {
  url: string;
  title: string;
  type: "audio" | "video";
  onOpen: () => void;
}) {
  return (
    <section className="mt-4 max-w-[760px] rounded border border-[#d6d6d6] bg-white">
      <h2 className="border-b border-[#e4e4e4] px-4 py-3 text-base font-bold text-slate-950">{title}</h2>
      <div className="bg-[#f8f8f8] p-4">
        {type === "audio" ? (
          <div className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4">
            <audio src={url} controls className="w-full" preload="metadata" />
            <button
              type="button"
              onClick={onOpen}
              className="self-start rounded bg-[#1f6f91] px-4 py-2 text-sm font-bold text-white hover:bg-[#195b78]"
            >
              Open Listener
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="group relative block aspect-video w-full overflow-hidden bg-black text-white"
            aria-label={`Open ${title}`}
          >
            <video src={url} className="h-full w-full object-cover opacity-80" preload="metadata" muted playsInline />
            <span className="absolute inset-0 grid place-items-center">
              <span className="rounded-full bg-white/90 px-5 py-3 text-sm font-bold text-[#152238] shadow-lg group-hover:bg-white">
                Play Intro Video
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

function MediaModal({
  url,
  title,
  type,
  onClose,
}: {
  url: string;
  title: string;
  type: "audio" | "video";
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-200 px-3 py-1 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <div className="bg-slate-950 p-4">
          {type === "audio" ? (
            <div className="rounded bg-white p-4">
              <audio src={url} controls autoPlay className="w-full" />
            </div>
          ) : (
            <video src={url} controls autoPlay className="aspect-video w-full bg-black" />
          )}
        </div>
      </div>
    </div>
  );
}

function ActionRate({ label, icon, price }: { label: string; icon: React.ReactNode; price?: number }) {
  return (
    <div>
      <button
        type="button"
        className="flex h-14 w-full flex-col items-center justify-center rounded bg-[#4b861b] text-xs font-bold text-white transition-colors hover:bg-[#3f7416]"
      >
        {icon}
        <span>{label}</span>
      </button>
      <p className="mt-1 text-center text-sm">
        <span className="font-semibold">{displayPrice(price)}</span>
      </p>
    </div>
  );
}

function SmallService({ label, icon, price }: { label: string; icon: React.ReactNode; price?: number }) {
  return (
    <button
      type="button"
      className="h-10 rounded border border-[#cfcfcf] bg-white text-sm font-bold text-slate-900 hover:bg-slate-50"
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
        {typeof price === "number" ? ` - ${displayPrice(price)}` : ""}
      </span>
    </button>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="mb-1 text-base leading-6">
      <span className="font-bold text-[#a92828]">{label}: </span>
      <span>{value}</span>
    </p>
  );
}

function SectionDivider() {
  return <div className="my-4 max-w-[760px] border-t border-dotted border-[#d8b7a0]" />;
}

function ReviewRow({ review, featured }: { review: Review; featured: boolean }) {
  return (
    <article className="border-b border-[#cfd8dc] py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          {featured ? <p className="font-bold">Featured Review</p> : null}
          <p className="font-semibold">
            <span className="text-[#d33a2c] underline underline-offset-2">{review.user?.name || "Anonymous"}</span>{" "}
            <span className="text-slate-600">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
          {review.sessionType ? <p className="text-slate-400 capitalize">{review.sessionType} Reading</p> : null}
        </div>
        <div className="shrink-0">{StarRating(review.rating || 5, 16)}</div>
      </div>
      <p className="mt-3 text-base leading-7">{review.comment || "Great reading"}</p>
      <p className="mt-3 text-sm">
        Was this review helpful? <span className="text-[#1f6f91] underline">Yes</span>
      </p>
    </article>
  );
}

function MiniAdvisor({ advisor }: { advisor: Advisor }) {
  const { user, profile } = advisor;
  const advisorName = displayName(user.name);
  return (
    <Link href={`/advisors/${user._id}`} className="block text-center">
      <div className="relative mb-2 aspect-square w-full overflow-hidden rounded border border-slate-200 bg-slate-100">
        {user.profilePhoto ? (
          <Image src={user.profilePhoto} alt={advisorName} fill className="object-cover" sizes="180px" unoptimized />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-300">PP</div>
        )}
      </div>
      <p className="font-bold leading-tight">{advisorName}</p>
      <div className="mt-1">{StarRating(profile.avgRating || 0, 13)}</div>
      <p className="text-xs">
        <span className="font-semibold">{displayPrice(profile.pricing?.chatPerMin)}</span>
      </p>
      <p className={`mt-1 text-xs font-semibold ${profile.isOnline ? "text-[#4b861b]" : "text-[#d33a2c]"}`}>
        {profile.isOnline ? "Available now" : "Busy logged on"}
      </p>
    </Link>
  );
}
