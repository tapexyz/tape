/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.5
          }
        }
      },
      animation: {
        shimmer: 'shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
      },
      borderRadius: {
        small: '12px',
        medium: '16px',
        large: '20px'
      },
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
        ultrawide: '1800px'
      },
      colors: {
        // card bg in dark
        cod: '#0a0a0a',
        // hover states
        smoke: '#1a1a1a',
        gallery: '#eaeaea',
        brand: {
          50: '#eff9ff',
          100: '#dff2ff',
          200: '#b8e8ff',
          300: '#78d6ff',
          400: '#39c4ff',
          500: '#06aaf1',
          600: '#0088ce',
          700: '#006da7',
          800: '#025b8a',
          900: '#084c72',
          950: '#06304b'
        }
      }
    }
  },
  variants: { extend: {} }
}
