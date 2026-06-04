"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type CountryOption,
  fetchCountries,
  fetchCities,
  countryNameFrom,
} from "./countries-data";

// Re-export the server-safe API so existing client imports keep working.
export {
  fetchCountries,
  fetchCities,
  countryNameFrom,
  currencyCodeFrom,
  formatLocation,
} from "./countries-data";
export type { CountryOption } from "./countries-data";

/** React hook (client only): the cached country list. */
export function useCountries(): CountryOption[] {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  useEffect(() => {
    let active = true;
    fetchCountries().then((c) => active && setCountries(c));
    return () => {
      active = false;
    };
  }, []);
  return countries;
}

/** React hook (client only): the city list for the given country. */
export function useCities(iso2?: string): string[] {
  const [cities, setCities] = useState<string[]>([]);
  useEffect(() => {
    if (!iso2) {
      setCities([]);
      return;
    }
    let active = true;
    fetchCities(iso2).then((c) => active && setCities(c));
    return () => {
      active = false;
    };
  }, [iso2]);
  return cities;
}

/** React hook (client only): a resolver turning an ISO-2 code into a name. */
export function useCountryName(): (iso2?: string) => string {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  useEffect(() => {
    let active = true;
    fetchCountries().then((c) => active && setCountries(c));
    return () => {
      active = false;
    };
  }, []);
  return useCallback(
    (iso2?: string) => countryNameFrom(countries, iso2),
    [countries],
  );
}
