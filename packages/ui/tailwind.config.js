const base = require("./tailwind-preset");

/** @type {import ('tailwindcss').Config} */
module.exports = {
  ...base,
  content: ["./**/*.{ts,tsx}"],
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography")
  ]
};
