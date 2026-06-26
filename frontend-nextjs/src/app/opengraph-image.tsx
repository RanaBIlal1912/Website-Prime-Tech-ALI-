import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data";
import { BRAND_FALLBACK } from "@/lib/site";

export const alt = "Prime Tech — Security & IT Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const settings = await getSiteSettings();
  const title = settings?.site_title || BRAND_FALLBACK.site_title;
  const tagline = settings?.tagline || BRAND_FALLBACK.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#060608",
          backgroundImage:
            "radial-gradient(60% 60% at 15% 20%, rgba(0,170,255,0.35) 0%, transparent 60%), radial-gradient(55% 55% at 88% 70%, rgba(123,47,247,0.30) 0%, transparent 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "linear-gradient(135deg,#00aaff,#7b2ff7,#00ffc8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
              color: "#060608",
            }}
          >
            P
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#f1f1f5" }}>{title}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 40, color: "#9a9aab", maxWidth: 900 }}>{tagline}</div>
        <div style={{ marginTop: 28, fontSize: 26, color: "#00ffc8" }}>
          CCTV · Networking · Fiber Optic · Access Control · Biometrics
        </div>
      </div>
    ),
    { ...size },
  );
}
