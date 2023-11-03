import localFont from 'next/font/local'

export const tapeFont = localFont({
  src: [
    {
      path: './font/Satoshi-Regular.woff2',
      weight: '400'
    },
    {
      path: './font/Satoshi-Medium.woff2',
      weight: '500'
    },
    {
      path: './font/Satoshi-Bold.woff2',
      weight: '700'
    }
  ],
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  variable: '--font-tape'
})
