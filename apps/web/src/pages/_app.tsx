import '@radix-ui/themes/styles.css'
import 'tippy.js/dist/tippy.css'
import '../styles/index.css'
import '../styles/theme.config.css'

import Providers from '@components/Common/Providers'
import { tapeFont } from '@dragverse/browser/font'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        body {
          font-family: ${tapeFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  )
}

export default App
