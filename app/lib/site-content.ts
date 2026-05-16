import { api } from "./api";
import type { SectionsMap, SiteContentDoc, SiteContentSlug } from "./types";

/**
 * Server-side fetch for SiteContent. ISR-friendly (60 s revalidate by default).
 * Returns an empty document if the backend is unreachable — keeps pages from
 * crashing in dev when the API is down.
 */
export const getSiteContent = async <S extends SiteContentSlug>(
  slug: S,
  revalidate: number | false = 60
): Promise<SectionsMap[S]> => {
  try {
    const r = await api.get<SiteContentDoc<SectionsMap[S]>>(
      `/cms/site-content/${slug}`,
      undefined,
      { revalidate, skipAuth: true }
    );
    return (r.data?.sections || {}) as SectionsMap[S];
  } catch {
    return {} as SectionsMap[S];
  }
};
