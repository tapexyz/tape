import type { Config } from "tailwindcss";
const base = require("@tape.xyz/ui/tailwind-preset");

const config: Config = {
  ...base,
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
