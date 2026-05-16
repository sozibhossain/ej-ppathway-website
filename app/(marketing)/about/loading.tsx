import { Skeleton } from "../../components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-page text-center max-w-4xl space-y-4">
          <Skeleton className="h-10 sm:h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-page max-w-3xl">
          <div className="rounded-2xl border border-[#cfe9f0] bg-[#f0f9fb] p-6 md:p-8 space-y-3">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-page text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-8 sm:mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#f0f9fb] border border-[#cfe9f0] rounded-2xl p-5 flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
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
          <Skeleton className="h-4 w-80 max-w-full mx-auto" />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </>
  );
}
