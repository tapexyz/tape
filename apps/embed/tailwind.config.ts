const base = require("@tape.xyz/ui/tailwind-preset");
import type { Config } from "tailwindcss";

const config: Config = {
  ...base,
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  plugins: [require("@tailwindcss/aspect-ratio")]
};

export default config;
