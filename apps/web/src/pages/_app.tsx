import type { AppProps } from 'next/app'

import Providers from '@components/Common/Providers'
import '@radix-ui/themes/styles.css'
import { tapeFont } from '@tape.xyz/browser/font'
import React from 'react'
import 'tippy.js/dist/tippy.css'

import '../styles/index.css'
import '../styles/theme.config.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style global jsx>{`
        body {
          font-family: ${tapeFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  )
}

export default App
