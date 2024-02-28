import '../styles/index.css'

import Providers from '@components/Common/Providers'
import { tapeFont } from '@tape.xyz/browser/font'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { AppProps } from 'next/app'
import React from 'react'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        html {
          font-family: ${tapeFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </Providers>
  )
}

export default App
