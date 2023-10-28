import authLink from '@lib/authLink'
import { LivepeerConfig } from '@livepeer/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getLivepeerClient, videoPlayerTheme } from '@tape.xyz/browser'
import { apolloClient, ApolloProvider } from '@tape.xyz/lens/apollo'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import ErrorBoundary from '../ErrorBoundary'
import GlobalDialogs from '../GlobalDialogs'
import Layout from '../Layout'
import SubscriptionProvider from './SubscriptionProvider'
import ThemeProvider from './ThemeProvider'
import Web3Provider from './Web3Provider'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

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

const client = apolloClient(authLink)

const Providers = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter()

  return (
    <ErrorBoundary>
      <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
        <Web3Provider>
          <ThemeProvider>
            <ApolloProvider client={client}>
              <QueryClientProvider client={queryClient}>
                <SubscriptionProvider />
                <GlobalDialogs />
                <Layout
                  skipNav={NO_NAV_PATHS.includes(pathname)}
                  skipPadding={NO_PADDING_PATHS.includes(pathname)}
                >
                  {children}
                </Layout>
              </QueryClientProvider>
            </ApolloProvider>
          </ThemeProvider>
        </Web3Provider>
      </LivepeerConfig>
    </ErrorBoundary>
  )
}

export default Providers
