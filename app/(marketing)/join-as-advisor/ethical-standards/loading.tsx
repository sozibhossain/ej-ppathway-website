import { Skeleton, FaqItemSkeleton } from "../../../components/ui/Skeleton";

export default function EthicalStandardsLoading() {
  return (
    <>
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-page text-center max-w-3xl space-y-3">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl mx-auto mb-4 sm:mb-5" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-6 text-center space-y-3">
              <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
            </div>
          ))}
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
