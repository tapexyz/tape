import authLink from '@lib/authLink'
import { loadLocale } from '@lib/i18n'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { LivepeerConfig } from '@livepeer/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getLivepeerClient, videoPlayerTheme } from '@tape.xyz/browser'
import { apolloClient, ApolloProvider } from '@tape.xyz/lens/apollo'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import ErrorBoundary from '../ErrorBoundary'
import SubscriptionProvider from './SubscriptionProvider'
import ThemeProvider from './ThemeProvider'
import Web3Provider from './Web3Provider'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    loadLocale()
  }, [])

  return (
    <ErrorBoundary>
      <I18nProvider i18n={i18n}>
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <Web3Provider>
            <ThemeProvider>
              <ApolloProvider client={apolloClient(authLink)}>
                <QueryClientProvider client={queryClient}>
                  <SubscriptionProvider />
                  {children}
                </QueryClientProvider>
              </ApolloProvider>
            </ThemeProvider>
          </Web3Provider>
        </LivepeerConfig>
      </I18nProvider>
    </ErrorBoundary>
  )
}

export default Providers
