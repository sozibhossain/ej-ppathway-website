import Image from "next/image";
import { StarIcon } from "../ui/Icons";
import { api } from "../../lib/api";
import type { Review } from "../../lib/types";

export async function Testimonials({
  sectionLabel,
  title,
  subtitle,
  trustpilotRating,
  totalReviews
}: {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  trustpilotRating?: string;
  totalReviews?: string;
}) {
  let reviews: Review[] = [];
  try {
    const r = await api.get<Review[]>("/reviews/featured-testimonials", undefined, { revalidate: 60, skipAuth: true });
    reviews = r.data || [];
  } catch {
    reviews = [];
  }

  // Fallback to showcase reviews so the carousel is never empty
  if (reviews.length === 0) {
    try {
      const r = await api.get<Review[]>("/reviews/showcase", undefined, { revalidate: 60, skipAuth: true });
      reviews = r.data || [];
    } catch {
      reviews = [];
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container-page text-center">
        {sectionLabel && <div className="text-[#0e7490] text-sm font-semibold mb-2 inline-flex items-center gap-1">+ {sectionLabel}</div>}
        {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>}
        {subtitle && <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}

        {(trustpilotRating || totalReviews) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm">
            <span className="text-slate-700">Excellent</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-500 text-white">
              {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={12} />)}
            </span>
            {trustpilotRating && <span className="text-slate-700"><b>{trustpilotRating}</b> based on {totalReviews}</span>}
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">★ Trustpilot</span>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {reviews.slice(0, 5).map((r) => (
              <ReviewCard key={r._id} review={r} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-slate-500">No featured testimonials yet.</p>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const name = review.isAdminShowcase ? review.showcaseName : review.user?.name;
  const photo = review.isAdminShowcase ? review.showcasePhoto : review.user?.profilePhoto;
  const location = review.isAdminShowcase ? review.showcaseLocation : undefined;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left flex flex-col h-full">
      <div className="flex text-emerald-500 mb-2">
        {Array.from({ length: review.rating }).map((_, i) => (
          <StarIcon key={i} size={14} />
        ))}
      </div>
      <p className="text-sm text-slate-700 flex-1 line-clamp-5 mb-3">&ldquo;{review.comment || "Great experience."}&rdquo;</p>
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100">
        {photo ? (
          <Image src={photo} alt={name || ""} width={32} height={32} className="rounded-full" unoptimized />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-200" />
        )}
        <div className="text-xs">
          <div className="font-semibold text-slate-900">{name || "Anonymous"}</div>
          {location && <div className="text-slate-500">{location}</div>}
        </div>
        <span className="ml-auto text-[10px] text-emerald-600 inline-flex items-center gap-0.5">
          <StarIcon size={10} /> Verified
        </span>
      </div>
    </div>
  );
}
