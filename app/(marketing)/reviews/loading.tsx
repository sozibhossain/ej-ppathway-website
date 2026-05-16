import { Skeleton, ReviewCardSkeleton, FaqItemSkeleton } from "../../components/ui/Skeleton";

export default function ReviewsLoading() {
  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl space-y-3">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl mx-auto mb-4 sm:mb-5" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-page text-center">
          <Skeleton className="h-8 w-1/2 mx-auto mb-8 sm:mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-3" />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-page text-center max-w-3xl">
          <Skeleton className="h-7 w-64 mx-auto mb-6 sm:mb-8" />
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
