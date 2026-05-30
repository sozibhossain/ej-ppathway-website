"use client";

import { useAuthModal } from "../../components/layout/AuthModalProvider";

export function JoinHeroApplyButton({ label }: { label?: string }) {
  const auth = useAuthModal();
  return (
    <button
      onClick={() => auth.open("apply")}
      className="inline-flex items-center justify-center h-13 px-8 rounded-xl bg-[#027B98] text-white font-semibold hover:bg-[#025e76] transition-colors"
    >
      {label || "Apply Now"}
    </button>
  );
}
