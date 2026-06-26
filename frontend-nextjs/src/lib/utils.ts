// Small shared helpers.

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1"
).replace(/\/api\/v1\/?$/, "");

// Resolve an image field (which may be empty, a relative media path, or an absolute URL)
// into a usable absolute URL, or null when there is nothing to show.
export function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${BACKEND_ORIGIN}${trimmed}`;
  return `${BACKEND_ORIGIN}/${trimmed}`;
}

// Extract a YouTube video id from an id or any common URL form.
export function youTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// Deterministic gradient pick so fallback tiles vary but stay stable per item.
const GRADIENTS = [
  "from-[#00aaff]/25 via-[#7b2ff7]/20 to-[#00ffc8]/15",
  "from-[#7b2ff7]/25 via-[#00aaff]/15 to-[#00ffc8]/20",
  "from-[#00ffc8]/20 via-[#00aaff]/20 to-[#7b2ff7]/25",
  "from-[#00aaff]/30 via-[#181822] to-[#7b2ff7]/20",
];

export function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}
