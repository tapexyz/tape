import localFont from 'next/font/local'

const bloomer = localFont({
  src: [
    {
      path: './Matter-Regular.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: './Matter-Medium.woff',
      weight: '500',
      style: 'normal'
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
  variable: '--font-bloomer',
  fallback: ['sans-serif'],
  preload: true,
  display: 'swap'
})

export default bloomer
