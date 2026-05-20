import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from "../../../components/ui/Icons";
import { api } from "../../../lib/api";
import type { Blog } from "../../../lib/types";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let blog: Blog | null = null;
  try {
    const r = await api.get<Blog>(`/cms/blogs/${id}`, undefined, {
      revalidate: 60,
      skipAuth: true,
    });
    blog = r.data || null;
  } catch {
    blog = null;
  }
  if (!blog) notFound();

  const date = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const photo = blog.profilePicture || blog.authorPhoto;

  return (
    <div className="container-page py-6">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-slate-700 hover:text-[#0e7490] bg-white px-4 py-2 rounded-full border border-slate-200 text-sm mb-6 transition-colors"
      >
        <ArrowLeftIcon size={16} /> Go Back
      </Link>

      <div className="relative rounded-2xl overflow-hidden">
        {blog.thumbnail ? (
          <div className="relative aspect-video sm:aspect-21/9">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="1200px"
              unoptimized
            />
          </div>
        ) : (
          <div className="aspect-video sm:aspect-21/9 bg-linear-to-br from-[#0e7490] to-[#06495d]" />
        )}
        <div className="relative md:absolute md:left-1/2 md:bottom-0 md:-translate-x-1/2 md:translate-y-1/3 md:max-w-2xl -mt-16 md:mt-0 mx-4 md:mx-0 w-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-lg flex items-center gap-3 sm:gap-4">
            {photo ? (
              <Image
                src={photo}
                alt={blog.authorName || ""}
                width={64}
                height={64}
                className="rounded-full shrink-0 h-14 w-14 sm:h-16 sm:w-16 object-cover ring-2 ring-[#cfe9f0]"
                unoptimized
              />
            ) : (
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-slate-200 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              {blog.category && (
                <span className="inline-block px-2 py-0.5 rounded bg-[#0e7490] text-white text-[10px] font-semibold mb-1">
                  {blog.category}
                </span>
              )}
              <div className="font-bold text-slate-900 truncate text-sm sm:text-base">
                {blog.authorName}
              </div>
              {blog.authorTitle && (
                <div className="text-xs text-slate-500 truncate">{blog.authorTitle}</div>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 mt-1">
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon size={11} /> {date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon size={11} /> {blog.readMinutes || 6} min read
                </span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                aria-label="Share"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                aria-label="Save"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Saved
              </button>
            </div>
          </div>
        </div>
      </div>

      <article className="mt-8 sm:mt-16 md:mt-24 mb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {blog.title}
        </h1>
        <div
          className="prose prose-slate max-w-none text-slate-800 leading-relaxed prose-img:rounded-xl prose-a:text-[#0e7490] prose-headings:text-slate-900"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />
      </article>
    </div>
  );
}
