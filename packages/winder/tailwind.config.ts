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
      backgroundColor: {
        site: "hsl(var(--site-background))",
        card: "hsl(var(--card-background))"
      },
      borderColor: {
        custom: "hsl(var(--border))"
      },
      divideColor: {
        custom: "hsl(var(--divider))"
      },
      textColor: {
        muted: "hsl(var(--text-muted))",
        primary: "hsl(var(--text-primary))",
        secondary: "hsl(var(--text-secondary))"
      },
      borderRadius: {
        custom: "var(--radius)",
        card: "calc(var(--radius) + 11px)"
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))"
        },
        upbyte: {
          DEFAULT: "hsl(var(--upbyte))"
        }
      },
      screens: {
        "3xl": "1800px"
      }
    }
  }
} satisfies Config;
