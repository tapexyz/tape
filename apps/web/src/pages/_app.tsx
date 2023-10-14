import '../styles/index.css'
import 'tippy.js/dist/tippy.css'
import '@radix-ui/themes/styles.css'
import '../styles/theme.config.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import MetaTags from '@components/Common/MetaTags'
import useAuthPersistStore from '@lib/store/auth'
import { tapeFont } from '@tape.xyz/browser/font'
import { AUTH_ROUTES } from '@tape.xyz/constants'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect } from 'react'

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))

const NO_NAV_PATHS = ['/login']
const NO_PADDING_PATHS = ['/u/[profile]', '/login', '/bytes', '/bytes/[id]']

const App = ({ Component, pageProps }: AppProps) => {
  const { pathname, replace, asPath } = useRouter()
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    if (!selectedSimpleProfile?.id && AUTH_ROUTES.includes(pathname)) {
      replace(`/auth?next=${asPath}`)
    }
  }, [selectedSimpleProfile, pathname, asPath, replace])

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
