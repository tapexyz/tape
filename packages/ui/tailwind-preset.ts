/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
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
        cod: '#18122D',
        // hover states
        smoke: '#18122D',
        gallery: '#21186E',
        brand: {
          50: '#FCF1FC',
          100: '#FCF1FC',
          200: '#F0B5F0',
          300: '#78d6ff',
          400: '#39c4ff',
          500: '#EB83EA',
          600: '#EB83EA',
          700: '#9A7CFF',
          800: '#815BFF',
          900: '#DE1BDD',
          950: '#5D24BB'
        }
      }
    }
  },
  variants: { extend: {} }
}
