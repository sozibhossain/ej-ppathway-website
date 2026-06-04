/**
 * API client for the public marketing website.
 *
 * Works in both server components (no localStorage) and client components.
 * Auth token is read from cookie on the client side (set by login flow).
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

export const ACCESS_TOKEN_COOKIE = "pp_access_token";
export const REFRESH_TOKEN_COOKIE = "pp_refresh_token";
export const USER_COOKIE = "pp_user";

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown> & {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
};

export const setAuthCookies = (accessToken: string, refreshToken: string, user: unknown) => {
  if (typeof document === "undefined") return;
  const days = 30;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; expires=${expires}; path=/; samesite=lax`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(refreshToken)}; expires=${expires}; path=/; samesite=lax`;
  document.cookie = `${USER_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; expires=${expires}; path=/; samesite=lax`;
};

export const clearAuthCookies = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  document.cookie = `${USER_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const getCurrentUser = <T = unknown>(): T | null => {
  const raw = getCookie(USER_COOKIE);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  isFormData?: boolean;
  skipAuth?: boolean;
  /** Next.js fetch revalidate option (server components only). */
  revalidate?: number | false;
  /** Server-side: pass the request cookies if you need auth in a Server Component. */
  serverToken?: string;
};

const buildQuery = (
  query?: Record<string, string | number | boolean | undefined | null>
) => {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    params.append(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
};

export async function apiRequest<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<ApiEnvelope<T>> {
  const {
    method = "GET",
    body,
    query,
    headers = {},
    isFormData = false,
    skipAuth = false,
    revalidate,
    serverToken
  } = opts;

  const url = `${API_BASE_URL}${path}${buildQuery(query)}`;

  const finalHeaders: Record<string, string> = { ...headers };
  if (!isFormData) finalHeaders["Content-Type"] = "application/json";
  if (!skipAuth) {
    const token = serverToken ?? getCookie(ACCESS_TOKEN_COOKIE);
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchInit: RequestInit & { next?: { revalidate?: number | false } } = {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body)
  };
  if (typeof revalidate !== "undefined") fetchInit.next = { revalidate };

  const res = await fetch(url, fetchInit);
  let json: ApiEnvelope<T>;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(`Invalid JSON response (${res.status})`, res.status, null);
  }
  if (!res.ok || json.success === false) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, res.status, json);
  }
  return json;
}

export const api = {
  get: <T = unknown>(path: string, query?: RequestOptions["query"], opts: Partial<RequestOptions> = {}) =>
    apiRequest<T>(path, { method: "GET", query, ...opts }),
  post: <T = unknown>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
    apiRequest<T>(path, { method: "POST", body, ...opts }),
  put: <T = unknown>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
    apiRequest<T>(path, { method: "PUT", body, ...opts }),
  patch: <T = unknown>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
    apiRequest<T>(path, { method: "PATCH", body, ...opts }),
  delete: <T = unknown>(path: string, opts: Partial<RequestOptions> = {}) =>
    apiRequest<T>(path, { method: "DELETE", ...opts })
};
