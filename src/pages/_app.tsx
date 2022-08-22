import '../styles/index.css'
import '@vime/core/themes/default.css'

import FullPageLoader from '@components/Common/FullPageLoader'
import usePersistStore from '@lib/store/persist'
import { AUTH_ROUTES } from '@utils/data/auth-routes'
import { AUTH } from '@utils/url-path'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'

export { reportWebVitals } from 'next-axiom'

const Providers = dynamic(() => import('../components/Common/Providers'), {
  suspense: true
})
const Layout = dynamic(() => import('../components/Common/Layout'), {
  suspense: true
})

const App = ({ Component, pageProps }: AppProps) => {
  const isAuthenticated = usePersistStore((state) => state.isAuthenticated)
  const { pathname, replace, asPath } = useRouter()

  useEffect(() => {
    if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      replace(`${AUTH}?next=${asPath}`)
    }
  }, [isAuthenticated, pathname, asPath, replace])

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
  )
}

export default App
