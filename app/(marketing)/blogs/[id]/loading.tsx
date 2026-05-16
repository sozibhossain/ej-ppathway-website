import { Skeleton } from "../../../components/ui/Skeleton";

export default function BlogDetailLoading() {
  return (
    <div className="container-page py-6">
      <Skeleton className="h-9 w-28 rounded-full mb-6" />

      <div className="relative rounded-2xl overflow-hidden">
        <Skeleton className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-none" />
        <div className="relative md:absolute md:left-12 md:bottom-12 md:max-w-2xl -mt-12 md:mt-0 mx-4 md:mx-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow flex items-center gap-3 sm:gap-4">
            <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 shrink-0" rounded="full" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      </div>

      <article className="mt-8 sm:mt-10 mb-12 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-48 w-full rounded-xl my-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </article>
    </div>
  );
}
