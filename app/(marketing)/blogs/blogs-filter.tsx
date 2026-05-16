"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "../../components/ui/Icons";

export function BlogsFilter({
  categories,
  initialQuery,
  activeCategory,
  searchPlaceholder
}: {
  categories: string[];
  initialQuery: string;
  activeCategory: string;
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [, startTransition] = useTransition();

  const push = (next: { q?: string; category?: string }) => {
    const params = new URLSearchParams(sp.toString());
    if (typeof next.q === "string") {
      if (next.q) params.set("q", next.q); else params.delete("q");
    }
    if (typeof next.category === "string") {
      if (next.category && next.category !== "All") params.set("category", next.category);
      else params.delete("category");
    }
    startTransition(() => {
      router.push(`/blogs${params.toString() ? `?${params}` : ""}`);
    });
  };

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); push({ q }); }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder || "Search articles…"}
            className="w-full h-12 pl-11 pr-4 rounded-lg bg-white border border-slate-200 text-sm"
          />
        </div>
        <button type="submit" className="h-12 px-6 rounded-lg bg-[#0e7490] text-white font-semibold w-full sm:w-auto">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {categories.map((c) => {
          const active = (activeCategory || "All") === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => push({ category: c })}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                active
                  ? "bg-[#0e7490] text-white border-[#0e7490]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#0e7490]"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
