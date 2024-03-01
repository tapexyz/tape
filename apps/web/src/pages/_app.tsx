import '../styles/index.css';

import Providers from '@components/Common/Providers';
import { tapeFont } from '@dragverse/browser/font';
import type { AppProps } from 'next/app';

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
