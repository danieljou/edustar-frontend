import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-dm-serif)", "DM Serif Display", "serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0d1b2a",
          2: "#1e3a5f",
          3: "#4a6080",
          4: "#8fa3b8",
          5: "#c5d3df",
        },
        blue: {
          DEFAULT: "#1a3c8f",
          dark: "#122d6e",
          light: "#e8eef9",
          lighter: "#f3f6fc",
        },
        cyan: { DEFAULT: "#0099cc", light: "#e0f4fb" },
        ivory: "#f5f7fa",
        line: { DEFAULT: "#e2e8f0", dark: "#c9d4e0" },
        success: { DEFAULT: "#0a7c4e", light: "#e0f5ec" },
        danger: { DEFAULT: "#c0392b", light: "#fdecea" },
        warning: { DEFAULT: "#b45309", light: "#fef3cd" },
        purple: { DEFAULT: "#6b48ff", light: "#ede9ff" },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(13,27,42,0.07)",
        md: "0 4px 20px rgba(13,27,42,0.10)",
        lg: "0 8px 36px rgba(13,27,42,0.13)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
