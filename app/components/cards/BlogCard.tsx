import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ClockIcon, CalendarIcon } from "../ui/Icons";
import type { Blog } from "../../lib/types";

export function BlogCard({ blog, featured }: { blog: Blog; featured?: boolean }) {
  const author = blog.authorName;
  const photo = blog.profilePicture || blog.authorPhoto;
  const date = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  if (featured) {
    return (
      <Link
        href={`/blogs/${blog._id}`}
        className="block bg-[#e6f4f8] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        <div className="relative aspect-video md:aspect-auto bg-slate-200">
          {blog.thumbnail ? (
            <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" sizes="500px" unoptimized />
          ) : null}
          {blog.category && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded bg-[#0e7490] text-white text-[10px] font-semibold">
              {blog.category}
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{blog.title}</h3>
          {blog.excerpt && <p className="text-sm text-slate-600 mb-4">{blog.excerpt}</p>}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="inline-flex items-center gap-1"><CalendarIcon size={12} /> {date}</span>
            <span className="inline-flex items-center gap-1"><ClockIcon size={12} /> {blog.readMinutes || 6} min read</span>
          </div>
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/60">
            {photo ? (
              <Image src={photo} alt={author || ""} width={32} height={32} className="rounded-full" unoptimized />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-300" />
            )}
            <div className="text-xs">
              <div className="font-semibold text-slate-900">{author}</div>
              {blog.authorTitle && <div className="text-slate-500">{blog.authorTitle}</div>}
            </div>
          </div>
          <span className="mt-3 text-[#0e7490] text-sm font-semibold inline-flex items-center gap-1">
            Read Article <ArrowRightIcon size={14} />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blogs/${blog._id}`}
      className="block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition"
    >
      <div className="relative aspect-video bg-slate-100">
        {blog.thumbnail ? (
          <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" sizes="320px" unoptimized />
        ) : null}
        {blog.category && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded bg-[#0e7490] text-white text-[10px] font-semibold">
            {blog.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{blog.title}</h3>
        {blog.excerpt && <p className="text-sm text-slate-600 mb-3 line-clamp-2">{blog.excerpt}</p>}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="inline-flex items-center gap-1"><CalendarIcon size={12} /> {date}</span>
          <span className="inline-flex items-center gap-1"><ClockIcon size={12} /> {blog.readMinutes || 6} min read</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          {photo ? (
            <Image src={photo} alt={author || ""} width={28} height={28} className="rounded-full" unoptimized />
          ) : (
            <div className="h-7 w-7 rounded-full bg-slate-200" />
          )}
          <div className="text-xs">
            <div className="font-semibold text-slate-900 truncate">{author}</div>
            {blog.authorTitle && <div className="text-slate-500 truncate">{blog.authorTitle}</div>}
          </div>
        </div>
        <span className="mt-3 text-[#0e7490] text-sm font-semibold inline-flex items-center gap-1">
          Read Article <ArrowRightIcon size={14} />
        </span>
      </div>
    </Link>
  );
}
