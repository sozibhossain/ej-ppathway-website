import { Skeleton, AdvisorCardSkeleton, ReviewCardSkeleton, FaqItemSkeleton } from "../components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f5fbfd]">
        <div className="container-page grid lg:grid-cols-2 gap-8 md:gap-10 items-center py-7 sm:py-9 md:py-12">
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-5">
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-10 sm:h-12 md:h-16 w-full" />
            <Skeleton className="h-10 sm:h-12 md:h-16 w-4/5" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Skeleton className="h-14 w-full sm:w-44 rounded-full" />
              <Skeleton className="h-14 w-full sm:w-44 rounded-full" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-3" />
          <Skeleton className="h-4 w-80 max-w-full mx-auto" />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center px-2 space-y-3">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured advisors */}
      <section className="py-8 sm:py-10 md:py-12 bg-[#eaf4f8]">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-3" />
          <Skeleton className="h-4 w-80 max-w-full mx-auto" />
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <AdvisorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-3" />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#f0f9fb] rounded-2xl border border-[#cfe9f0] p-6 text-left space-y-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-3" />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container-page text-center max-w-3xl">
          <Skeleton className="h-7 w-64 mx-auto mb-6" />
          <div className="text-left">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaqItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
