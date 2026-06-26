import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 320,
          fontWeight: 900,
          color: "#060608",
          background: "linear-gradient(135deg,#00aaff,#7b2ff7,#00ffc8)",
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
