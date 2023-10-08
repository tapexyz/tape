import { STATIC_ASSETS } from '@tape.xyz/constants'
import { Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'

export const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-space'
})

export const clashDisplay = localFont({
  src: [
    {
      path: `${STATIC_ASSETS}/fonts/ClashDisplay-Regular.woff2`,
      weight: '400',
      style: 'normal'
    },
    {
      path: `${STATIC_ASSETS}/fonts/ClashDisplay-Medium.woff2`,
      weight: '500',
      style: 'normal'
    },
    {
      path: `${STATIC_ASSETS}/fonts/ClashDisplay-Semibold.woff2`,
      weight: '600',
      style: 'normal'
    },
    {
      path: `${STATIC_ASSETS}/fonts/ClashDisplay-Bold.woff2`,
      weight: '700',
      style: 'normal'
    }
  ],
  variable: '--font-clash',
  preload: true,
  weight: '200'
})
