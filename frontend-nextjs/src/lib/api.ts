// Server-side data access. Runs in React Server Components.
// Uses native fetch so Next.js can cache + revalidate (ISR) responses.
import "server-only";
import type { Paginated } from "./types";

const BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

// Revalidate content every 5 minutes by default (good cache hit rate + fresh CMS edits).
const DEFAULT_REVALIDATE = 300;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiGet<T>(
  path: string,
  opts: { revalidate?: number; query?: Record<string, string | number | boolean | undefined> } = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    next: { revalidate: opts.revalidate ?? DEFAULT_REVALIDATE },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new ApiError(`GET ${path} failed (${res.status})`, res.status);
  }
  return (await res.json()) as T;
}

// Safe list fetch — never throws on transient backend errors; returns [] so the
// page still renders (with an empty-state) rather than crashing the whole route.
export async function apiList<T>(
  path: string,
  opts: { revalidate?: number; query?: Record<string, string | number | boolean | undefined> } = {},
): Promise<T[]> {
  try {
    const data = await apiGet<Paginated<T> | T[]>(path, opts);
    if (Array.isArray(data)) return data;
    return data.results ?? [];
  } catch {
    return [];
  }
}

// Safe single fetch — returns null on 404/error so callers can notFound().
export async function apiOne<T>(
  path: string,
  opts: { revalidate?: number } = {},
): Promise<T | null> {
  try {
    return await apiGet<T>(path, opts);
  } catch {
    return null;
  }
}
