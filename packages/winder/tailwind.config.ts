import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: "var(--tape-font-sans)",
      serif: "var(--tape-font-serif)"
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        border: {
          DEFAULT: "hsl(var(--border))",
          foreground: "hsl(var(--border-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
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
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
