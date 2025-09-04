import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0A0A",
          50: "#FAFAFA",
          100: "#F5F5F5",
          900: "#0A0A0A",
        },
        accent: {
          red: "var(--accent-red)",
          yellow: "var(--accent-yellow)",
          blue: "var(--accent-blue)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;

