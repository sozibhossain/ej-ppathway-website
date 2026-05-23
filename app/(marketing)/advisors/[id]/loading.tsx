import { Skeleton } from "../../../components/ui/Skeleton";

export default function AdvisorDetailLoading() {
  return (
    <div className="container-page py-8">
      <Skeleton className="h-9 w-28 rounded-full mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          {/* Profile header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
            <div className="flex-1 min-w-0 space-y-2 w-full">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Expertise */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
            <Skeleton className="h-5 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-11 w-full rounded-full mt-3" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
