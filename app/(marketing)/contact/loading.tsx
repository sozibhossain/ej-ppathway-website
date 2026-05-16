import { Skeleton, FaqItemSkeleton } from "../../components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div className="container-page py-8 sm:py-10 md:py-14">
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <Skeleton className="h-10 w-2/3 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <aside className="space-y-4">
          <div className="bg-[#e6f4f8] border border-[#cfe9f0] rounded-2xl p-5 space-y-4">
            <Skeleton className="h-5 w-2/3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 mt-1" rounded="full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#e6f4f8] border border-[#cfe9f0] rounded-2xl p-5 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-11 w-full rounded-lg mt-3" />
          </div>
        </aside>

        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 space-y-4">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-full" />
        </section>
      </div>

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
    </div>
  );
}
