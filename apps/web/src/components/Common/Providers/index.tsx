import { getLivepeerClient, videoPlayerTheme } from '@dragverse/browser'
// Import Privy and wagmi components and functions
import { PRIVY_APP_ID } from '@dragverse/constants' // Ensure this is defined in your constants
import { apolloClient, ApolloProvider } from '@dragverse/lens/apollo'
import authLink from '@lib/authLink'
import { LivepeerConfig } from '@livepeer/react'
import { PrivyProvider } from '@privy-io/react-auth'
// Import required chains for your wagmi configuration
// import { mainnet } from '@privy-io/wagmi/chains' // Update these imports to match your desired chains
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import ErrorBoundary from '../ErrorBoundary'
import ThemeProvider from './ThemeProvider'

const SubscriptionProvider = dynamic(() => import('./SubscriptionProvider'))
const TogglesProvider = dynamic(() => import('./TogglesProvider'))
const Web3Provider = dynamic(() => import('./Web3Provider'))
const Layout = dynamic(() => import('../Layout'))

const NO_TOP_NAV_PATHS = ['/login']
const NO_BOTTOM_NAV_PATHS = ['/bangers']
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

// Build your wagmi config
// const wagmiConfig = createConfig({
// chains: mainnet.chains
// connectors: [
//   // Define your connectors here
// ],
// provider: mainnet.rpcUrls.default(), // Set up your provider, e.g., for mainnet
// webSocketProvider: mainnet.rpcUrls.default(), // Set up your WebSocket provider, if applicable
// })

const Providers = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter()

  return (
    <ErrorBoundary>
      <Web3Provider>
        <ApolloProvider client={apolloQueryClient}>
          <QueryClientProvider client={reactQueryClient}>
            <ThemeProvider>
              <SubscriptionProvider />
              <TogglesProvider />
              <LivepeerConfig client={livepeerClient} theme={videoPlayerTheme}>
                <PrivyProvider appId={PRIVY_APP_ID} config={{}}>
                  {/* <WagmiProvider config={wagmiConfig}> */}
                  <Layout
                    skipNav={NO_TOP_NAV_PATHS.includes(pathname)}
                    skipBottomNav={NO_BOTTOM_NAV_PATHS.includes(pathname)}
                    skipPadding={NO_PADDING_PATHS.includes(pathname)}
                  >
                    {children}
                  </Layout>
                  {/* </WagmiProvider> */}
                </PrivyProvider>
              </LivepeerConfig>
            </ThemeProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  )
}

export default Providers
