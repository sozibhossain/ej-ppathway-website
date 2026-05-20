import { Suspense } from "react";
import Image from "next/image";
import { StarIcon } from "../ui/Icons";
import { ReviewCardSkeleton } from "../ui/Skeleton";
import { api } from "../../lib/api";
import type { Review } from "../../lib/types";

type Props = {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  trustpilotRating?: string;
  totalReviews?: string;
};

export function Testimonials({ sectionLabel, title, subtitle, trustpilotRating, totalReviews }: Props) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container-page text-center">
        {sectionLabel && (
          <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">
            + {sectionLabel}
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        )}

        {(trustpilotRating || totalReviews) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm">
            <span className="text-slate-700 font-medium">Excellent</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-emerald-500 text-white">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={12} />
              ))}
            </span>
            {trustpilotRating && (
              <span className="text-slate-700">
                <b>{trustpilotRating}</b> Out of 5 based on {totalReviews}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              ★ Trustpilot
            </span>
          </div>
        )}

        <Suspense fallback={<TestimonialsSkeletonGrid />}>
          <TestimonialsGrid />
        </Suspense>
      </div>
    </section>
  );
}

async function TestimonialsGrid() {
  let reviews: Review[] = [];
  try {
    const r = await api.get<Review[]>("/reviews/featured-testimonials", undefined, { revalidate: 60, skipAuth: true });
    reviews = r.data || [];
  } catch {
    reviews = [];
  }

  if (reviews.length === 0) {
    try {
      const r = await api.get<Review[]>("/reviews/showcase", undefined, { revalidate: 60, skipAuth: true });
      reviews = r.data || [];
    } catch {
      reviews = [];
    }
  }

  if (reviews.length === 0) {
    return <p className="mt-10 text-sm text-slate-500">No featured testimonials yet.</p>;
  }

  return (
    <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {reviews.slice(0, 5).map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  );
}

function TestimonialsSkeletonGrid() {
  return (
    <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const name = review.isAdminShowcase ? review.showcaseName : review.user?.name;
  const photo = review.isAdminShowcase ? review.showcasePhoto : review.user?.profilePhoto;
  const location = review.isAdminShowcase ? review.showcaseLocation : undefined;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 text-left flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500 text-white w-fit mb-3">
        {Array.from({ length: Math.max(1, Math.min(5, review.rating || 5)) }).map((_, i) => (
          <StarIcon key={i} size={10} />
        ))}
      </div>
      <p className="text-xs sm:text-sm text-slate-700 flex-1 line-clamp-5 mb-3 leading-relaxed">
        &ldquo;{review.comment || "Great experience."}&rdquo;
      </p>
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100">
        {photo ? (
          <Image src={photo} alt={name || ""} width={28} height={28} className="rounded-full" unoptimized />
        ) : (
          <div className="h-7 w-7 rounded-full bg-slate-200" />
        )}
        <div className="text-xs min-w-0 flex-1">
          <div className="font-semibold text-slate-900 truncate">{name || "Anonymous"}</div>
          {location && <div className="text-slate-500 truncate">{location}</div>}
        </div>
        <span className="text-[9px] sm:text-[10px] text-emerald-600 inline-flex items-center gap-0.5 shrink-0">
          <StarIcon size={9} /> Verified
        </span>
      </div>
    </div>
  );
}
