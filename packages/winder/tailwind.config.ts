import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: "var(--font-geist)",
      serif: "var(--font-editorial)"
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        border: "hsla(var(--border), 0.06)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsla(var(--secondary), 0.08)",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))"
        }
      },
      borderRadius: {
        rounded: "var(--radius)",
        card: "calc(var(--radius) + 11px)"
      },
      screens: {
        "3xl": "1800px"
      }
    }
  },
  plugins: []
} satisfies Config;
