import { Skeleton } from "../../components/ui/Skeleton";

export default function PrivacyLoading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
        <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl mx-auto mb-4 sm:mb-5" />
        <Skeleton className="h-10 w-2/3 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
        <Skeleton className="h-3 w-32 mx-auto" />
      </header>

      <article className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-10 space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
        ))}
      </article>
    </div>
  );
}
