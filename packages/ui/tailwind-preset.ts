/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        large: '20px',
        medium: '16px',
        small: '12px'
      },
      colors: {
        brand: {
          100: '#dff2ff',
          200: '#b8e8ff',
          300: '#78d6ff',
          400: '#39c4ff',
          50: '#eff9ff',
          500: '#06aaf1',
          600: '#0088ce',
          700: '#006da7',
          800: '#025b8a',
          900: '#084c72',
          950: '#06304b'
        },
        // card bg in dark
        cod: '#0a0a0a',
        gallery: '#eaeaea',
        // hover states
        smoke: '#1a1a1a'
      },
      screens: {
        desktop: '1280px',
        laptop: '1024px',
        tablet: '640px',
        ultrawide: '1800px'
      }
    }
  },
  variants: { extend: {} }
}
