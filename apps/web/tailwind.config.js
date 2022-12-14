/** @type {import ('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
        ultrawide: '1800px'
      },
      colors: {
        theme: '#151a2c'
      },
      transitionProperty: {
        width: 'width'
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp')
  ]
}
