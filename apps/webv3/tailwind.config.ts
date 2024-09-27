import base from "@tape.xyz/winder/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  presets: [base],
  content: ["./src/**/*.{ts,tsx}", "../../packages/winder/src/**/*.{ts,tsx}"]
} satisfies Config;
