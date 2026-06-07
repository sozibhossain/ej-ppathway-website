import Link from "next/link";

const APPLY_HREF = "/join-as-advisor/apply";

export function JoinHeroApplyButton({ label }: { label?: string }) {
  return (
    <Link
      href={APPLY_HREF}
      className="inline-flex items-center justify-center h-13 px-8 rounded-xl bg-[#027B98] text-white font-semibold hover:bg-[#025e76] transition-colors"
    >
      {label || "Apply Now"}
    </Link>
  );
}
