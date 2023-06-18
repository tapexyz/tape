import '@rainbow-me/rainbowkit/styles.css'
import 'tippy.js/dist/tippy.css'
import '../styles/index.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import useAuthPersistStore from '@lib/store/auth'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect } from 'react'
import { AUTH_ROUTES } from 'utils/data/auth-routes'
import bloomer from 'utils/font'

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { pathname, replace, asPath } = useRouter()
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )

  useEffect(() => {
    if (!selectedChannelId && AUTH_ROUTES.includes(pathname)) {
      replace(`/auth?next=${asPath}`)
    }
  }, [selectedChannelId, pathname, asPath, replace])

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Providers>
        <style jsx global>{`
          body {
            font-family: ${bloomer.style.fontFamily};
          }
        `}</style>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
  )
}

export default App
