import { notFound } from "next/navigation";
import { MarketplaceAdvisorDetail } from "../../../components/advisor/MarketplaceAdvisorDetail";
import { api } from "../../../lib/api";
import { getSiteContent } from "../../../lib/site-content";
import type { Advisor, Review } from "../../../lib/types";

type Detail = {
  user: Advisor["user"];
  profile: Advisor["profile"];
  reviews: Review[];
  isFavorite?: boolean;
};

export default async function AdvisorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const labels = (await getSiteContent("advisor-detail")).labels || {};
  const footer = (await getSiteContent("global")).footer || {};

  let advisor: Detail | null = null;
  try {
    const r = await api.get<Detail>(`/advisors/${id}`, undefined, { revalidate: 60, skipAuth: true });
    advisor = r.data || null;
  } catch {
    advisor = null;
  }
  if (!advisor || !advisor.user) notFound();

  // Recommended / similar advisors ("You may also like").
  let recommended: Advisor[] = [];
  try {
    const rr = await api.get<Advisor[]>(`/advisors/${id}/recommended`, { limit: 4 }, { revalidate: 120, skipAuth: true });
    recommended = (rr.data || []).filter((a) => a.user?._id && a.user._id !== id).slice(0, 4);
  } catch {
    recommended = [];
  }

  return (
    <MarketplaceAdvisorDetail
      advisor={advisor}
      recommended={recommended}
      advisorId={id}
      labels={labels}
      footer={footer}
    />
  );
}
