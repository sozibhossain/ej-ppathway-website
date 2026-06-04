"use client";

import { useEffect, useState } from "react";
import {
  type CurrencyInfo,
  fetchCurrencyCatalog,
  formatMoney,
} from "./currency-data";

// Re-export the server-safe API so existing imports keep working.
export {
  fetchCurrencyCatalog,
  symbolFor,
  symbolFrom,
  formatMoney,
} from "./currency-data";
export type { CurrencyInfo } from "./currency-data";

/** Hook: the cached currency catalog (loads on first mount). */
export function useCurrencyCatalog(): CurrencyInfo[] {
  const [list, setList] = useState<CurrencyInfo[]>([]);
  useEffect(() => {
    let active = true;
    fetchCurrencyCatalog().then((l) => active && setList(l));
    return () => {
      active = false;
    };
  }, []);
  return list;
}

/** Hook: a money formatter that re-renders once the catalog has loaded. */
export function useMoney(): (
  amount: number | null | undefined,
  code?: string | null,
  opts?: { decimals?: number },
) => string {
  useCurrencyCatalog();
  return formatMoney;
}
