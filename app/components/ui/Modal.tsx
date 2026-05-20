"use client";

import { ReactNode, useEffect } from "react";
import { XIcon } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  hideClose?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
};

export function Modal({ open, onClose, children, hideClose, size = "md" }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-start md:items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${sizeClass[size]} bg-white rounded-2xl shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideClose && (
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 h-9 w-9 rounded-full bg-white text-slate-600 hover:bg-slate-100 inline-flex items-center justify-center shadow-md border border-slate-100 transition-colors"
          >
            <XIcon size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
