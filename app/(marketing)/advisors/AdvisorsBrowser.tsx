"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdvisorCard } from "../../components/cards/AdvisorCard";
import { AdvisorCardSkeleton } from "../../components/ui/Skeleton";
import { api } from "../../lib/api";
import type { Advisor } from "../../lib/types";

const EXPERTISE = [
  "Love & Relationship",
  "Dream Interpretation",
  "Career",
  "Deliverance",
  "Family",
  "Marriage",
  "Finances",
];

const STYLES = [
  "Compassionate",
  "Direct",
  "Expressive",
  "Thoughtful",
  "Inspirational",
  "Straightforward",
];

const CONNECTION = [
  { value: "call", label: "Voice Call" },
  { value: "chat", label: "Chat" },
  { value: "video", label: "Video Call" },
];

const SORT_OPTIONS = [
  { value: "available", label: "Available Now" },
  { value: "appointments", label: "Appointments" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "price_high", label: "Price (High to Low)" },
  { value: "price_low", label: "Price (Low to High)" },
];

type Props = {
  initialAdvisors: Advisor[];
  emptyStateText?: string;
};

const toggle = (set: string[], value: string): string[] =>
  set.includes(value) ? set.filter((v) => v !== value) : [...set, value];

export function AdvisorsBrowser({ initialAdvisors, emptyStateText }: Props) {
  const [expertise, setExpertise] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [connection, setConnection] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");

  const [advisors, setAdvisors] = useState<Advisor[]>(initialAdvisors);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstRender = useRef(true);

  const activeCount = expertise.length + styles.length + connection.length + (sortBy ? 1 : 0);

  const query = useMemo(() => {
    const q: Record<string, string | number | boolean> = { limit: 24 };
    if (expertise.length) q.expertise = expertise.join(",");
    if (styles.length) q.styles = styles.join(",");
    if (connection.length) q.connection = connection.join(",");
    if (sortBy === "available") q.availableNow = true;
    else if (sortBy === "alphabetical") q.sortBy = "alphabetical";
    else if (sortBy === "price_high") q.sortBy = "price_high";
    else if (sortBy === "price_low") q.sortBy = "price_low";
    return q;
  }, [expertise, styles, connection, sortBy]);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const r = await api.get<Advisor[]>("/advisors/search", query, { skipAuth: true });
      setAdvisors(r.data || []);
    } catch {
      setAdvisors([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-apply on change (skip first mount so the SSR list stays until filtered).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(applyFilters, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const clearAll = () => {
    setExpertise([]);
    setStyles([]);
    setConnection([]);
    setSortBy("");
  };

  // Shared filter sections (used by both the desktop sidebar and the mobile drawer).
  const filterGroups = (
    <div className="divide-y divide-slate-100">
      <FilterGroup title="Expertise" defaultOpen>
        {EXPERTISE.map((item) => (
          <CheckRow key={item} label={item} checked={expertise.includes(item)} onChange={() => setExpertise((s) => toggle(s, item))} />
        ))}
      </FilterGroup>
      <FilterGroup title="Style">
        {STYLES.map((item) => (
          <CheckRow key={item} label={item} checked={styles.includes(item)} onChange={() => setStyles((s) => toggle(s, item))} />
        ))}
      </FilterGroup>
      <FilterGroup title="Connection">
        {CONNECTION.map((item) => (
          <CheckRow key={item.value} label={item.label} checked={connection.includes(item.value)} onChange={() => setConnection((s) => toggle(s, item.value))} />
        ))}
      </FilterGroup>
      <FilterGroup title="Sort By" defaultOpen>
        {SORT_OPTIONS.map((item) => (
          <CheckRow
            key={item.value}
            label={item.label}
            type="radio"
            checked={sortBy === item.value}
            onChange={() => setSortBy((s) => (s === item.value ? "" : item.value))}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile trigger */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:border-[#0e7490]/40"
        >
          <FilterIcon />
          Advanced Filter
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-[#0e7490] text-white text-[11px] font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden lg:sticky lg:top-24">
          <PanelHeader activeCount={activeCount} onClear={clearAll} />
          {filterGroups}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
            <button onClick={clearAll} className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={applyFilters} className="flex-1 px-3 py-2.5 rounded-xl bg-[#0e7490] text-white text-sm font-semibold hover:bg-[#0c647c]">
              Apply
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer (off-canvas) */}
      <div className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl rounded-r-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-[#f0f9fb]">
            <div>
              <span className="font-semibold text-slate-900">Advanced Filtering</span>
              {activeCount > 0 && (
                <span className="ml-2 text-xs text-[#0e7490] font-medium">{activeCount} selected</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearAll} className="text-xs font-medium text-[#0e7490] hover:underline">
                Clear all
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="h-8 w-8 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-white"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">{filterGroups}</div>

          <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex-1 px-3 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                applyFilters();
                setDrawerOpen(false);
              }}
              className="flex-1 px-3 py-3 rounded-xl bg-[#0e7490] text-white text-sm font-semibold hover:bg-[#0c647c]"
            >
              Apply{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 min-w-0">
        {activeCount > 0 && (
          <div className="mb-4 text-sm text-slate-500">
            {loading ? "Filtering…" : `${advisors.length} advisor${advisors.length === 1 ? "" : "s"} found`}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <AdvisorCardSkeleton key={i} />
            ))}
          </div>
        ) : advisors.length === 0 ? (
          <p className="text-center text-slate-500 py-20">
            {emptyStateText || "No advisors match your filters."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {advisors.map((a) => (
              <AdvisorCard key={a.user._id} advisor={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PanelHeader({ activeCount, onClear }: { activeCount: number; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#f0f9fb]">
      <span className="font-semibold text-slate-900 text-sm">
        Advanced Filtering
        {activeCount > 0 && <span className="ml-1.5 text-xs text-[#0e7490]">({activeCount})</span>}
      </span>
      <button onClick={onClear} className="text-xs font-medium text-[#0e7490] hover:underline">
        Clear all
      </button>
    </div>
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="px-4 py-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-sm font-semibold text-slate-800"
      >
        {title}
        <ChevronIcon open={open} />
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  type = "checkbox",
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer text-sm text-slate-600 hover:text-slate-900">
      <span>{label}</span>
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-[#0e7490] focus:ring-[#0e7490]"
      />
    </label>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
