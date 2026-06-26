import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ported verbatim from the legacy design system (and SiteSetting theme tokens).
        primary: { DEFAULT: "#00aaff", 600: "#0090dd" },
        secondary: { DEFAULT: "#7b2ff7" },
        accent: { DEFAULT: "#00ffc8" },
        ink: {
          DEFAULT: "#060608", // page background
          card: "#12121a",
          card2: "#181822",
        },
        content: {
          DEFAULT: "#f1f1f5",
          muted: "#9a9aab",
        },
        hairline: "#25252f",
      },
      borderRadius: {
        brand: "16px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(0,170,255,0.35)",
        card: "0 18px 40px -20px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #00aaff 0%, #7b2ff7 60%, #00ffc8 120%)",
        "hero-mesh":
          "radial-gradient(60% 60% at 15% 20%, rgba(0,170,255,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 85% 60%, rgba(123,47,247,0.18) 0%, transparent 60%), radial-gradient(40% 40% at 50% 110%, rgba(0,255,200,0.12) 0%, transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-green": {
          "0%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.5)" },
          "70%": { boxShadow: "0 0 0 14px rgba(37,211,102,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(.2,.8,.2,1) both",
        "pulse-green": "pulse-green 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
