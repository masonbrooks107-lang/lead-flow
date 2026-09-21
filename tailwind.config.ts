import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep pine — sidebar and headings
        pine: {
          900: "#0F2620",
          800: "#13312C",
          700: "#1B4038",
          600: "#2A5B4F",
          300: "#8FB3A8",
        },
        // Warm neutral canvas
        canvas: "#F7F6F3",
        rule: "#E4E1DA",
        ink: "#1F2421",
        muted: "#6E6B64",
        // Single signal colour, used sparingly
        signal: "#C98A00",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        stat: ["1.875rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
};

export default config;
