import { api } from "./api";

/**
 * Server-safe country/city catalog helpers (no React). Importable from both
 * Server Components and Client Components. The React hooks live in
 * `./countries` (a "use client" module that re-exports everything here).
 */

export type CountryOption = {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phone_code: string;
  capital: string;
  currency: string;
};

let _countries: CountryOption[] | null = null;
let _inflight: Promise<CountryOption[]> | null = null;
const _cityCache = new Map<string, string[]>();

/** Fetch the country catalog once and cache it (server + client safe). */
export async function fetchCountries(): Promise<CountryOption[]> {
  if (_countries) return _countries;
  if (!_inflight) {
    _inflight = api
      .get<CountryOption[]>("/locations/countries", undefined, {
        skipAuth: true,
        revalidate: 60 * 60 * 24,
      })
      .then((r) => (_countries = r.data ?? []))
      .catch(() => (_countries = []));
  }
  return _inflight;
}

/** Fetch (and cache) the flat city list for a country by ISO-2 code. */
export async function fetchCities(iso2: string): Promise<string[]> {
  const code = (iso2 || "").trim().toUpperCase();
  if (!code) return [];
  const cached = _cityCache.get(code);
  if (cached) return cached;
  try {
    const r = await api.get<{ name: string }[]>(
      `/locations/countries/${code}/cities`,
      undefined,
      { skipAuth: true },
    );
    const list = (r.data ?? []).map((c) => c.name);
    _cityCache.set(code, list);
    return list;
  } catch {
    return [];
  }
}

/** Resolve an ISO-2 code to a full country name using a loaded country list. */
export function countryNameFrom(
  countries: CountryOption[],
  iso2?: string,
): string {
  if (!iso2) return "";
  return countries.find((c) => c.iso2 === iso2)?.name ?? iso2;
}

/** Resolve a country's default ISO-4217 currency code using a loaded list. */
export function currencyCodeFrom(
  countries: CountryOption[],
  iso2?: string,
): string {
  if (!iso2) return "";
  return countries.find((c) => c.iso2 === iso2)?.currency ?? "";
}

/** Build a readable "City, Country" label from discrete fields. */
export function formatLocation(city?: string, countryName?: string): string {
  return [city, countryName].filter(Boolean).join(", ");
}
