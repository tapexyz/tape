import type { AppProps } from 'next/app'

import { LivepeerConfig } from '@livepeer/react'
import {
  getLivepeerClient,
  setFingerprint,
  videoPlayerTheme
} from '@tape.xyz/browser'
import { tapeFont } from '@tape.xyz/browser/font'
import React, { useEffect } from 'react'

import '../styles/index.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    setFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
      <style global jsx>{`
        body {
          font-family: ${tapeFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </LivepeerConfig>
  )
}

export default MyApp
