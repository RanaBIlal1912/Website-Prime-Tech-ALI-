import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prime Tech — Security & IT Solutions",
    short_name: "Prime Tech",
    description:
      "Professional CCTV, networking, fiber optic, access control and biometric solutions across Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#060608",
    theme_color: "#060608",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
