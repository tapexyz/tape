import localFont from 'next/font/local'

export const tapeFont = localFont({
  src: './font/Satoshi-Variable.ttf',
  fallback: ['system-ui', 'sans-serif'],
  preload: true
})
