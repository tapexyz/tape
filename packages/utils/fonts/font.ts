import localFont from 'next/font/local'

const bloomer = localFont({
  src: [
    {
      path: './Bloomer-Regular.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: './Bloomer-Medium.woff',
      weight: '500',
      style: 'normal'
    },
    {
      path: './Bloomer-SemiBold.woff',
      weight: '600',
      style: 'normal'
    },
    {
      path: './Bloomer-Bold.woff',
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
