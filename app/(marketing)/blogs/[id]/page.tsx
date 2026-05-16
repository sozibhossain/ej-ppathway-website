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
    const r = await api.get<Blog>(`/cms/blogs/${id}`, undefined, { revalidate: 60, skipAuth: true });
    blog = r.data || null;
  } catch {
    blog = null;
  }
  if (!blog) notFound();

  const date = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const photo = blog.profilePicture || blog.authorPhoto;

  return (
    <div className="container-page py-6">
      <Link href="/blogs" className="inline-flex items-center gap-2 text-slate-700 hover:text-[#0e7490] bg-white px-4 py-2 rounded-full border border-slate-200 text-sm mb-6">
        <ArrowLeftIcon size={16} /> Go Back
      </Link>

      <div className="relative rounded-2xl overflow-hidden">
        {blog.thumbnail ? (
          <div className="relative aspect-[21/9]">
            <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" sizes="1200px" unoptimized />
          </div>
        ) : (
          <div className="aspect-[21/9] bg-gradient-to-br from-[#0e7490] to-[#06495d]" />
        )}
        <div className="absolute left-6 right-6 bottom-6 md:left-12 md:bottom-12 max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow flex items-center gap-4">
            {photo ? (
              <Image src={photo} alt={blog.authorName || ""} width={64} height={64} className="rounded-full shrink-0" unoptimized />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-200 shrink-0" />
            )}
            <div className="min-w-0">
              {blog.category && <span className="inline-block px-2 py-0.5 rounded bg-[#0e7490] text-white text-[10px] font-semibold mb-1">{blog.category}</span>}
              <div className="font-bold text-slate-900 truncate">{blog.authorName}</div>
              {blog.authorTitle && <div className="text-xs text-slate-500 truncate">{blog.authorTitle}</div>}
              <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                <span className="inline-flex items-center gap-1"><CalendarIcon size={11} /> {date}</span>
                <span className="inline-flex items-center gap-1"><ClockIcon size={11} /> {blog.readMinutes || 6} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="mt-10 mb-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{blog.title}</h1>
        <div
          className="prose prose-slate max-w-none text-slate-800 leading-relaxed prose-img:rounded-xl prose-a:text-[#0e7490] prose-headings:text-slate-900"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />
      </article>
    </div>
  );
}
