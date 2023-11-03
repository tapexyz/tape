import '../styles/index.css'

import { LivepeerConfig } from '@livepeer/react'
import {
  getLivepeerClient,
  setFingerprint,
  videoPlayerTheme
} from '@tape.xyz/browser'
import { tapeFont } from '@tape.xyz/browser/font'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    setFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
      <style jsx global>{`
        body {
          font-family: ${tapeFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </LivepeerConfig>
  )
}

export default MyApp
