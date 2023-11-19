import '../styles/index.css'

import {
  getLivepeerClient,
  setFingerprint,
  videoPlayerTheme
} from '@dragverse/browser'
import { tapeFont } from '@dragverse/browser/font'
import { LivepeerConfig } from '@livepeer/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

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
