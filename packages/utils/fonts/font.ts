import localFont from 'next/font/local'

const matterFont = localFont({
  src: [
    {
      path: './Matter-Regular.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: './Matter-Medium.woff',
      weight: '500',
      style: 'medium'
    },
    {
      path: './Matter-SemiBold.woff',
      weight: '600',
      style: 'normal'
    },
    {
      path: './Matter-Bold.woff',
      weight: '700',
      style: 'normal'
    }
  ],
  variable: '--font-matter',
  fallback: ['sans-serif'],
  preload: true,
  display: 'swap'
})

export default matterFont
