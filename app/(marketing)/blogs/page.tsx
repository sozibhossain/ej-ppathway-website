import { BlogCard } from "../../components/cards/BlogCard";
import { BlogsFilter } from "./blogs-filter";
import { api } from "../../lib/api";
import { getSiteContent } from "../../lib/site-content";
import type { Blog } from "../../lib/types";

export default async function BlogsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const data = await getSiteContent("blogs");
  const categories = data.categories || ["All"];

  let blogs: Blog[] = [];
  try {
    const r = await api.get<Blog[]>("/cms/blogs", { limit: 30 }, { revalidate: 60, skipAuth: true });
    blogs = r.data || [];
  } catch {
    blogs = [];
  }

  const q = sp.q?.toLowerCase().trim() || "";
  const active = sp.category || "All";
  const filtered = blogs.filter((b) => {
    const inCat = active === "All" || b.category === active || b.type === active;
    const inQ = !q || b.title.toLowerCase().includes(q) || (b.excerpt || "").toLowerCase().includes(q);
    return inCat && inQ;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="py-10 sm:py-14 md:py-20 bg-[#eaf4f8]">
        <div className="container-page text-center max-w-3xl">
          {data.hero?.eyebrow && <div className="text-[#0e7490] text-sm font-semibold mb-2">+ {data.hero.eyebrow}</div>}
          {data.hero?.title && <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490]">{data.hero.title}</h1>}
          {data.hero?.subtitle && <p className="mt-3 text-sm sm:text-base text-slate-600">{data.hero.subtitle}</p>}

          <BlogsFilter
            categories={categories}
            initialQuery={q}
            activeCategory={active}
            searchPlaceholder={data.hero?.searchPlaceholder}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-20">No articles found.</p>
          ) : (
            <>
              {featured && (
                <div className="mb-8">
                  <div className="text-center text-[#0e7490] text-sm font-semibold mb-3">+ Featured Blog</div>
                  <BlogCard blog={featured} featured />
                </div>
              )}
              {rest.length > 0 && (
                <>
                  <div className="text-center text-[#0e7490] text-sm font-semibold mb-4">+ All Blogs</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {rest.map((b) => (
                      <BlogCard key={b._id} blog={b} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      {data.newsletterCta && (
        <section className="py-10 sm:py-14 bg-gradient-to-br from-[#0e7490] to-[#06495d] text-white">
          <div className="container-page text-center max-w-2xl">
            <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white text-[#0e7490] inline-flex items-center justify-center mb-4 sm:mb-5">
              ✉
            </div>
            {data.newsletterCta.title && <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{data.newsletterCta.title}</h2>}
            {data.newsletterCta.subtitle && <p className="mt-3 text-sm sm:text-base text-white/85">{data.newsletterCta.subtitle}</p>}
            <form className="mt-6 flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={data.newsletterCta.placeholder || "Enter your email"}
                className="flex-1 h-12 px-4 rounded-lg bg-white text-slate-900 placeholder:text-slate-500"
              />
              <button type="submit" className="h-12 px-6 rounded-lg bg-[#0e7490] text-white font-semibold border border-white/30">
                {data.newsletterCta.buttonLabel || "Subscribe"}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
