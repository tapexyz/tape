const base = require('@tape.xyz/ui/tailwind-preset')

/** @type {import ('tailwindcss').Config} */
module.exports = {
  ...base,
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')
  ]
}
