"use client";

import { useAuthModal } from "../../components/layout/AuthModalProvider";

export function JoinHeroApplyButton({ label }: { label?: string }) {
  const auth = useAuthModal();
  return (
    <button
      onClick={() => auth.open("apply")}
      className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white text-[#0e7490] font-semibold hover:bg-slate-100"
    >
      {label || "Apply Now"}
    </button>
  );
}
