import '../styles/index.css'
import 'tippy.js/dist/tippy.css'
import '@radix-ui/themes/styles.css'
import '../styles/theme.config.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import MetaTags from '@components/Common/MetaTags'
import { tapeFont } from '@tape.xyz/browser/font'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense } from 'react'

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))

const NO_NAV_PATHS = ['/login']
const NO_PADDING_PATHS = [
  '/u/[handle]',
  '/profile/[id]',
  '/login',
  '/bytes',
  '/bytes/[id]',
  '/404',
  '/500'
]

const App = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter()

  return (
    <>
      <MetaTags />
      <Suspense fallback={<FullPageLoader />}>
        <style jsx global>{`
          body {
            font-family: ${tapeFont.style.fontFamily};
          }
        `}</style>
        <Providers>
          <Layout
            skipNav={NO_NAV_PATHS.includes(pathname)}
            skipPadding={NO_PADDING_PATHS.includes(pathname)}
          >
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </Suspense>
    </>
  )
}

export default App
