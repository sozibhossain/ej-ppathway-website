"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { StarIcon, CheckIcon } from "../ui/Icons";
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
    <section className="py-8 sm:py-10 md:py-12 bg-white">
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

        <TestimonialsGrid />
      </div>
    </section>
  );
}

function TestimonialsGrid() {
  // Fetch on the client every load so newly featured/unfeatured testimonials
  // always show immediately (not blocked by the page's ISR cache).
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      let data: Review[] = [];
      try {
        const r = await api.get<Review[]>("/reviews/featured-testimonials", undefined, { skipAuth: true });
        data = r.data || [];
      } catch {
        data = [];
      }
      if (data.length === 0) {
        try {
          const r = await api.get<Review[]>("/reviews/showcase", undefined, { skipAuth: true });
          data = r.data || [];
        } catch {
          data = [];
        }
      }
      if (active) setReviews(data);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (reviews === null) {
    return (
      <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-full sm:w-85">
            <ReviewCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="mt-10 text-sm text-slate-500">No featured testimonials yet.</p>;
  }

  return <TestimonialsCarousel reviews={reviews} />;
}

function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });
  const [paused, setPaused] = useState(false);

  // Gentle auto-advance (no buttons); pauses on hover/drag/touch and loops at the end.
  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = setInterval(() => {
      if (paused) return;
      const el = trackRef.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const card = el.querySelector<HTMLElement>("[data-card]");
        const amount = card ? card.offsetWidth + 20 : el.clientWidth; // 20px = gap-5
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(id);
  }, [reviews.length, paused]);

  // Click-and-drag to move left/right with the mouse (touch uses native swipe).
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    setPaused(true);
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setPaused(false);
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className="mt-8 sm:mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex gap-5 overflow-x-auto snap-x snap-proximity no-scrollbar px-1 py-2 cursor-grab active:cursor-grabbing select-none"
      >
        {reviews.map((r) => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const name = review.isAdminShowcase ? review.showcaseName : review.user?.name;
  const photo = review.isAdminShowcase ? review.showcasePhoto : review.user?.profilePhoto;
  const location = review.isAdminShowcase ? review.showcaseLocation : undefined;
  const rating = Math.max(1, Math.min(5, review.rating || 5));
  return (
    <div
      data-card
      className="shrink-0 snap-start w-[85vw] max-w-85 sm:w-85 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 text-left flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500 text-white w-fit mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <StarIcon key={i} size={11} />
        ))}
      </div>

      <p className="text-xs sm:text-sm text-slate-700 flex-1 line-clamp-5 mb-3 leading-relaxed">
        &ldquo;{review.comment || "Great experience."}&rdquo;
      </p>

      <div className="flex items-start gap-2.5 mt-auto pt-3 border-t border-slate-100">
        {photo ? (
          <Image
            src={photo}
            alt={name || ""}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover shrink-0"
            unoptimized
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
        )}
        <div className="min-w-0 flex-1 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-900 truncate">{name || "Anonymous"}</span>
            <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] text-[#0e7490]">
              <CheckIcon size={11} /> Verified customer
            </span>
          </div>
          {location && <div className="text-slate-500 truncate mt-0.5">{location}</div>}
        </div>
      </div>
    </div>
  );
}
