import { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full"
} as const;

export function Skeleton({ className = "", rounded = "md", ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`animate-pulse bg-slate-200/80 ${roundedMap[rounded]} ${className}`}
      {...rest}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
  lineClassName = ""
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"} ${lineClassName}`}
          rounded="md"
        />
      ))}
    </div>
  );
}

/** Skeleton card matching the AdvisorCard shape used in featured/advisor grids. */
export function AdvisorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2.5 w-2/3" />
        <Skeleton className="h-2.5 w-1/3 mt-auto" />
        <Skeleton className="h-9 w-full rounded-full mt-2" />
      </div>
    </div>
  );
}

/** Skeleton card matching the BlogCard (compact) shape. */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <Skeleton className="h-7 w-7" rounded="full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-1/2" />
            <Skeleton className="h-2 w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton row matching the testimonial review card. */
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left flex flex-col h-full">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-3 w-3" />)}
      </div>
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
        <Skeleton className="h-8 w-8" rounded="full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-1/2" />
          <Skeleton className="h-2 w-1/3" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton row mimicking an FAQ accordion item. */
export function FaqItemSkeleton() {
  return (
    <div className="border-b border-slate-200 py-4 flex items-center justify-between gap-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-4" rounded="full" />
    </div>
  );
}
