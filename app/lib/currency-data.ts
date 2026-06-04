import { api } from "./api";

/**
 * Server-safe currency catalog helpers (no React). Importable from both Server
 * and Client Components. The React hooks live in `./currency` (a "use client"
 * module that re-exports everything here).
 */

export type CurrencyInfo = {
  code: string;
  symbol: string;
  currencyName: string;
  primaryCountry: string;
};

let _list: CurrencyInfo[] | null = null;
let _map: Record<string, string> | null = null; // code -> symbol
let _inflight: Promise<CurrencyInfo[]> | null = null;

// Tiny fallback so symbols still render before the catalog loads.
const FALLBACK: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  NGN: "₦",
};

/** Fetch the ISO-4217 currency catalog once and cache it (server + client safe). */
export async function fetchCurrencyCatalog(): Promise<CurrencyInfo[]> {
  if (_list) return _list;
  if (!_inflight) {
    _inflight = api
      .get<CurrencyInfo[]>("/currencies/catalog", undefined, {
        skipAuth: true,
        revalidate: 60 * 60 * 24,
      })
      .then((r) => {
        _list = r.data ?? [];
        _map = Object.fromEntries(_list.map((c) => [c.code, c.symbol]));
        return _list;
      })
      .catch(() => (_list = []));
  }
  return _inflight;
}

/** Resolve the display symbol for an ISO-4217 code (sync; uses the loaded cache). */
export function symbolFor(code?: string | null): string {
  if (!code) return "$";
  const c = code.toUpperCase();
  return (_map && _map[c]) || FALLBACK[c] || c;
}

/** Resolve a symbol from an explicitly-loaded catalog list (for Server Components). */
export function symbolFrom(list: CurrencyInfo[], code?: string | null): string {
  if (!code) return "$";
  const c = code.toUpperCase();
  return list.find((x) => x.code === c)?.symbol || FALLBACK[c] || c;
}

/** Format an amount with the correct currency symbol, e.g. formatMoney(59, "EUR") → "€59". */
export function formatMoney(
  amount: number | null | undefined,
  code?: string | null,
  opts?: { decimals?: number },
): string {
  const n = Number(amount);
  const sym = symbolFor(code);
  if (!Number.isFinite(n)) return `${sym}0`;
  const decimals = opts?.decimals ?? (Number.isInteger(n) ? 0 : 2);
  const grouped = n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sym}${grouped}`;
}
