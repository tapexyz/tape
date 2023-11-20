import localFont from 'next/font/local'

export const tapeFont = localFont({
  src: [
    {
      path: './font/Syne-Regular.ttf',
      weight: '400'
    },
    {
      path: './font/Syne-Medium.ttf',
      weight: '500'
    },
    {
      path: './font/Syne-Bold.ttf',
      weight: '700'
    }
  ],
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  variable: '--font-tape'
})
