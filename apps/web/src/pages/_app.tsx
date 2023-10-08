import '../styles/index.css'
import 'tippy.js/dist/tippy.css'
import '@radix-ui/themes/styles.css'
import '../styles/theme.config.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import MetaTags from '@components/Common/MetaTags'
import useAuthPersistStore from '@lib/store/auth'
import { spaceGrotesk } from '@tape.xyz/browser'
import { AUTH_ROUTES } from '@tape.xyz/constants'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect } from 'react'

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))

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
            font-family: ${spaceGrotesk.style.fontFamily};
          }
        `}</style>
        <Providers>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </Suspense>
    </>
  )
}

export default App
