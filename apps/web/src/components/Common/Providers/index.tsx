import { getLivepeerClient, videoPlayerTheme } from '@dragverse/browser'
import { apolloClient, ApolloProvider } from '@dragverse/lens/apollo'
import authLink from '@lib/authLink'
import { LivepeerConfig } from '@livepeer/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import ErrorBoundary from '../ErrorBoundary'
import ThemeProvider from './ThemeProvider'

const SubscriptionProvider = dynamic(() => import('./SubscriptionProvider'))
const Web3Provider = dynamic(() => import('./Web3Provider'))
const GlobalDialogs = dynamic(() => import('../GlobalDialogs'))
const Layout = dynamic(() => import('../Layout'))

const NO_NAV_PATHS = ['/login']
const NO_PADDING_PATHS = [
  '/u/[[...handle]]',
  '/bangers',
  '/profile/[id]',
  '/listen/[id]',
  '/login',
  '/bytes',
  '/bytes/[id]',
  '/404',
  '/500'
]

const apolloQueryClient = apolloClient(authLink)
const livepeerClient = getLivepeerClient()
const reactQueryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

const Providers = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter()

  return (
    <ErrorBoundary>
      <Web3Provider>
        <ApolloProvider client={apolloQueryClient}>
          <QueryClientProvider client={reactQueryClient}>
            <ThemeProvider>
              <SubscriptionProvider />
              <GlobalDialogs />
              <LivepeerConfig client={livepeerClient} theme={videoPlayerTheme}>
                <Layout
                  skipNav={NO_NAV_PATHS.includes(pathname)}
                  skipPadding={NO_PADDING_PATHS.includes(pathname)}
                >
                  {children}
                </Layout>
              </LivepeerConfig>
            </ThemeProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  )
}

export default Providers
