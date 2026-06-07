import { Skeleton, BlogCardSkeleton } from "../../components/ui/Skeleton";

export default function BlogsLoading() {
  return (
    <>
      <section className="py-7 sm:py-9 md:py-12 bg-[#eaf4f8]">
        <div className="container-page text-center max-w-3xl space-y-3">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <div className="mt-6 max-w-2xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 w-full sm:w-28 rounded-lg" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          {/* Featured blog */}
          <div className="mb-8">
            <Skeleton className="h-4 w-32 mx-auto mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#e6f4f8] rounded-2xl overflow-hidden">
              <Skeleton className="aspect-video md:aspect-auto w-full rounded-none" />
              <div className="p-4 sm:p-6 space-y-3">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center gap-2 pt-3 mt-auto">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2.5 w-1/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton className="h-4 w-24 mx-auto mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
