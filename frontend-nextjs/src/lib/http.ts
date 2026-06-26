// Client-side HTTP for form submissions / mutations (runs in the browser).
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export interface ApiFieldErrors {
  [field: string]: string[] | string;
}

// Normalize a DRF error response into a flat, human-readable message.
export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiFieldErrors | string | undefined;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const parts: string[] = [];
      for (const [field, val] of Object.entries(data)) {
        const text = Array.isArray(val) ? val.join(" ") : String(val);
        parts.push(field === "detail" ? text : `${field}: ${text}`);
      }
      if (parts.length) return parts.join(" • ");
    }
    if (err.response?.status === 429) {
      return "Too many submissions. Please try again in a little while.";
    }
    if (err.code === "ECONNABORTED") return "Request timed out. Please try again.";
    return err.message || "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
