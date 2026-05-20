"use client";

import { ReactNode, useState } from "react";
import { PlusIcon, MinusIcon } from "./Icons";

type Item = {
  question: string;
  answer: ReactNode;
};

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: Item[];
  defaultOpen?: number | null;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-slate-200">
      {items.map((it, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className={`w-full flex items-center justify-between gap-4 py-4 sm:py-5 text-left transition-colors ${
                isOpen ? "text-[#0e7490]" : "text-slate-900 hover:text-[#0e7490]"
              }`}
            >
              <span
                className={`font-semibold text-sm sm:text-base ${
                  isOpen ? "text-[#0e7490]" : ""
                }`}
              >
                {it.question}
              </span>
              <span className="text-[#0e7490] shrink-0">
                {isOpen ? <MinusIcon size={18} /> : <PlusIcon size={18} />}
              </span>
            </button>
            {isOpen && (
              <div className="pb-5 text-sm text-slate-600 leading-relaxed pr-8">{it.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
