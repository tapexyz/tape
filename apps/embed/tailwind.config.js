/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    '../../packages/utils/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/line-clamp')]
}
