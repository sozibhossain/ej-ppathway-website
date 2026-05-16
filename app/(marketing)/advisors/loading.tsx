import { Skeleton, AdvisorCardSkeleton } from "../../components/ui/Skeleton";

export default function AdvisorsListLoading() {
  return (
    <>
      <section className="py-10 sm:py-14 bg-[#f0f9fb]">
        <div className="container-page text-center max-w-3xl space-y-3">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-page">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <AdvisorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
