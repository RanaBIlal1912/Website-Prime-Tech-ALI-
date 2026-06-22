/** @type {import('next').NextConfig} */

// Derive the backend origin (host + port) from the public API base URL so that
// next/image can load media served by Django (e.g. http://127.0.0.1:8000/media/...).
// A remotePattern with an omitted `port` only matches URLs without an explicit
// port, so the port must be set explicitly when present.
function backendPattern() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  try {
    const u = new URL(base);
    return {
      protocol: u.protocol.replace(":", ""),
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
    };
  } catch {
    return { protocol: "http", hostname: "127.0.0.1", port: "8000" };
  }
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      backendPattern(),
      { protocol: "https", hostname: "**.primetech.pk" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
