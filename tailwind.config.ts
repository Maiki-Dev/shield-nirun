import type { Config } from "tailwindcss";

/** Semantic tokens backed by CSS variables (app/globals.css) — one class, both themes. */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        card: v("card"),
        soft: v("soft"),
        soft2: v("soft2"),
        ink: v("ink"),
        ink2: v("ink2"),
        muted: v("muted"),
        line: v("line"),
        accent: v("accent"),
        panel: v("panel"),
        sheet: v("sheet"),
        brand: { DEFAULT: "#00B4D8", light: "#00C2FF", dark: "#0096B7" },
        navy: "#0B192C",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-sm": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline-lg": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-sm": ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "-0.01em" }],
        "body-md": ["0.9375rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.005em" }],
        "label-lg": ["0.875rem", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-md": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.03em", fontWeight: "600" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.15", letterSpacing: "0.06em", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};
export default config;
