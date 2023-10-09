import { Space_Grotesk } from 'next/font/google'

export const tapeFont = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-space'
})
