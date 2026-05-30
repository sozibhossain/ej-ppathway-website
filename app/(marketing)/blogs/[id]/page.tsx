import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from "../../../components/ui/Icons";
import { api } from "../../../lib/api";
import type { Blog } from "../../../lib/types";
import { ShareButton } from "./share-button";

/**
 * Content is authored in a rich-text editor that stores HTML. Some older/pasted
 * posts still contain leftover Markdown emphasis tokens (e.g. **bold**) as
 * literal text inside the HTML. Convert those common tokens so they render
 * properly. This only touches `**...**` and `*...*` runs, which never appear in
 * valid HTML tag syntax, so existing markup is left intact.
 */
function renderArticleHtml(raw: string): string {
  return raw
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
}

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
    <div className="pb-12">
      <div className="container-page pt-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-[#0e7490] bg-white px-4 py-2 rounded-full border border-slate-200 text-sm transition-colors"
        >
          <ArrowLeftIcon size={16} /> Go Back
        </Link>
      </div>

      {/* Full-bleed hero image */}
      <div className="relative mt-4">
        {blog.thumbnail ? (
          <div className="relative h-64 sm:h-96 md:h-128">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-64 sm:h-96 md:h-128 bg-linear-to-br from-[#0e7490] to-[#06495d]" />
        )}

        {/* Author card — overlaps the bottom of the hero */}
        <div className="container-page">
          <div className="relative -mt-20 sm:-mt-16 md:-mt-20 mb-2 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center gap-4">
              {photo ? (
                <Image
                  src={photo}
                  alt={blog.authorName || ""}
                  width={96}
                  height={96}
                  className="rounded-full shrink-0 h-20 w-20 sm:h-24 sm:w-24 object-cover ring-4 ring-white shadow-md"
                  unoptimized
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-slate-200 shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                {blog.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#0e7490] text-white text-xs font-semibold mb-1.5">
                    {blog.category}
                  </span>
                )}
                <div className="font-bold text-slate-900 text-lg sm:text-xl">
                  {blog.authorName}
                </div>
                {blog.authorTitle && (
                  <div className="text-sm text-slate-500">{blog.authorTitle}</div>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon size={13} /> {date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon size={13} /> {blog.readMinutes || 6} min read
                  </span>
                </div>
              </div>

              <div className="shrink-0 sm:self-start">
                <ShareButton title={blog.title} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width article */}
      <article className="container-page mt-8 sm:mt-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {blog.title}
        </h1>
        <div
          className="prose prose-slate prose-lg max-w-none text-slate-800 leading-relaxed prose-img:rounded-xl prose-a:text-[#0e7490] prose-headings:text-slate-900"
          dangerouslySetInnerHTML={{ __html: renderArticleHtml(blog.content || "") }}
        />
      </article>
    </div>
  );
}
