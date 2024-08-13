import '../styles/index.css'

import { tapeFont } from '@tape.xyz/browser/font'
import type { AppProps } from 'next/app'
import React from 'react'

import Providers from '@/components/Common/Providers'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        html {
          font-family: ${tapeFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  )
}

export default App
