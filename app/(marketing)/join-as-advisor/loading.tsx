import { Skeleton, FaqItemSkeleton } from "../../components/ui/Skeleton";

export default function JoinAsAdvisorLoading() {
  return (
    <>
      <section className="relative py-12 sm:py-16 md:py-24 bg-[#0e7490]">
        <div className="container-page text-center space-y-4">
          <Skeleton className="h-10 sm:h-12 w-3/4 mx-auto bg-white/20" />
          <Skeleton className="h-4 w-2/3 mx-auto bg-white/20" />
          <Skeleton className="h-12 w-44 rounded-full mx-auto bg-white/20" />
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

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-page grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-11 w-40 rounded-full mt-3" />
          </div>
          <Skeleton className="aspect-square rounded-full max-w-xs sm:max-w-sm md:max-w-md mx-auto" />
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
