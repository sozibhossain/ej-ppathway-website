import { Skeleton, FaqItemSkeleton } from "../../components/ui/Skeleton";

export default function HowItWorksLoading() {
  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl space-y-3">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl mx-auto mb-4 sm:mb-5" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-8 sm:mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center px-2 space-y-3">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-page text-center">
          <Skeleton className="h-7 w-64 mx-auto mb-8 sm:mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#e6f4f8] rounded-2xl border border-[#cfe9f0] p-6 space-y-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
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
