import { Suspense } from "react";
import Image from "next/image";
import { BlogCard } from "../../components/cards/BlogCard";
import { BlogCardSkeleton, Skeleton } from "../../components/ui/Skeleton";
import { BlogsFilter } from "./blogs-filter";
import { api } from "../../lib/api";
import { getSiteContent } from "../../lib/site-content";
import type { Blog } from "../../lib/types";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const data = await getSiteContent("blogs");
  const categories = data.categories || ["All"];
  const q = sp.q?.toLowerCase().trim() || "";
  const active = sp.category || "All";

  return (
    <>
      {/* Hero */}
      <section className="relative py-10 sm:py-14 md:py-20 bg-[#eaf4f8] overflow-hidden">
        {data.hero?.backgroundImage && (
          <Image
            src={data.hero.backgroundImage}
            alt=""
            fill
            className="object-cover -z-10 opacity-30"
            unoptimized
          />
        )}
        <div className="container-page text-center max-w-3xl relative">
          {data.hero?.eyebrow && (
            <div className="text-[#0e7490] text-sm font-semibold mb-2">+ {data.hero.eyebrow}</div>
          )}
          {data.hero?.title && (
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">
              {data.hero.title}
            </h1>
          )}
          {data.hero?.subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600">{data.hero.subtitle}</p>
          )}

          <BlogsFilter
            categories={categories}
            initialQuery={q}
            activeCategory={active}
            searchPlaceholder={data.hero?.searchPlaceholder}
          />
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-page">
          <Suspense key={`${q}::${active}`} fallback={<BlogsGridSkeleton />}>
            <BlogsGrid q={q} active={active} />
          </Suspense>
        </div>
      </section>

      {/* Newsletter CTA */}
      {data.newsletterCta && (
        <section className="py-10 sm:py-14 bg-linear-to-br from-[#082e3a] to-[#0e5d75] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="container-page text-center max-w-2xl relative">
            <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            {data.newsletterCta.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {data.newsletterCta.title}
              </h2>
            )}
            {data.newsletterCta.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-white/85">
                {data.newsletterCta.subtitle}
              </p>
            )}
            <form className="mt-6 flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={data.newsletterCta.placeholder || "Enter your email"}
                className="flex-1 h-12 px-4 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-lg bg-[#0e7490] hover:bg-[#085a72] transition-colors text-white font-semibold border border-white/30"
              >
                {data.newsletterCta.buttonLabel || "Subscribe"}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

async function BlogsGrid({ q, active }: { q: string; active: string }) {
  let blogs: Blog[] = [];
  try {
    const r = await api.get<Blog[]>("/cms/blogs", { limit: 30 }, { revalidate: 60, skipAuth: true });
    blogs = r.data || [];
  } catch {
    blogs = [];
  }

  const filtered = blogs.filter((b) => {
    const inCat = active === "All" || b.category === active || b.type === active;
    const inQ = !q || b.title.toLowerCase().includes(q) || (b.excerpt || "").toLowerCase().includes(q);
    return inCat && inQ;
  });

  if (filtered.length === 0) {
    return <p className="text-center text-slate-500 py-20">No articles found.</p>;
  }

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {featured && (
        <div className="mb-10 sm:mb-12">
          <div className="text-center mb-4">
            <div className="text-[#0e7490] text-sm font-semibold mb-2">+ Featured Blog</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Featured Article
            </h2>
          </div>
          <BlogCard blog={featured} featured />
        </div>
      )}
      {rest.length > 0 && (
        <>
          <div className="text-center mb-6">
            <div className="text-[#0e7490] text-sm font-semibold mb-2">+ All Blogs</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Latest Articles
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {rest.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function BlogsGridSkeleton() {
  return (
    <>
      <div className="mb-8">
        <Skeleton className="h-4 w-32 mx-auto mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#e6f4f8] rounded-2xl overflow-hidden">
          <Skeleton className="aspect-video md:aspect-auto w-full rounded-none" />
          <div className="p-4 sm:p-6 space-y-3">
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-24 mx-auto mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
