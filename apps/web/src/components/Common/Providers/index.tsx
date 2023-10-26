import authLink from '@lib/authLink'
import { LivepeerConfig } from '@livepeer/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getLivepeerClient, videoPlayerTheme } from '@tape.xyz/browser'
import { apolloClient, ApolloProvider } from '@tape.xyz/lens/apollo'
import type { ReactNode } from 'react'

import ErrorBoundary from '../ErrorBoundary'
import GlobalDialogs from '../GlobalDialogs'
import SubscriptionProvider from './SubscriptionProvider'
import ThemeProvider from './ThemeProvider'
import Web3Provider from './Web3Provider'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
        <Web3Provider>
          <ThemeProvider>
            <ApolloProvider client={apolloClient(authLink)}>
              <QueryClientProvider client={queryClient}>
                <SubscriptionProvider />
                <GlobalDialogs />
                {children}
              </QueryClientProvider>
            </ApolloProvider>
          </ThemeProvider>
        </Web3Provider>
      </LivepeerConfig>
    </ErrorBoundary>
  )
}

export default Providers
