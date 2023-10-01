import { getLivepeerClient, videoPlayerTheme } from '@lenstube/browser'
import {
  IS_MAINNET,
  LENSTUBE_APP_NAME,
  WC_PROJECT_ID
} from '@lenstube/constants'
import { apolloClient, ApolloProvider } from '@lenstube/lens/apollo'
import authLink from '@lib/authLink'
import { loadLocale } from '@lib/i18n'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { LivepeerConfig } from '@livepeer/react'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import ErrorBoundary from '../ErrorBoundary'
import RainbowKit from './RainbowKit'

// TEMP: Duplicate to fix signTypedData_v4 issue. Remove once fixed on WC+WAGMI end.
const preferredChains = [
  IS_MAINNET ? polygon : polygonMumbai,
  IS_MAINNET ? polygon : polygonMumbai,
  mainnet,
  goerli,
  zora,
  zoraTestnet,
  optimism,
  optimismGoerli,
  base,
  baseGoerli
]

const { chains, publicClient } = configureChains(preferredChains, [
  publicProvider()
])

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet({ chains, projectId: WC_PROJECT_ID }),
      rainbowWallet({ chains, projectId: WC_PROJECT_ID }),
      ledgerWallet({ chains, projectId: WC_PROJECT_ID }),
      coinbaseWallet({ appName: LENSTUBE_APP_NAME, chains }),
      walletConnectWallet({
        chains,
        projectId: WC_PROJECT_ID,
        options: {
          qrModalOptions: {
            explorerExcludedWalletIds: 'ALL'
          },
          projectId: WC_PROJECT_ID
        }
      }),
      injectedWallet({ chains, shimDisconnect: true })
    ]
  }
])

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    loadLocale()
  }, [])

  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary>
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <WagmiConfig config={wagmiConfig}>
            <ThemeProvider defaultTheme="light" attribute="class">
              <RainbowKit chains={chains}>
                <ApolloProvider client={apolloClient(authLink)}>
                  <QueryClientProvider client={queryClient}>
                    {children}
                  </QueryClientProvider>
                </ApolloProvider>
              </RainbowKit>
            </ThemeProvider>
          </WagmiConfig>
        </LivepeerConfig>
      </ErrorBoundary>
    </I18nProvider>
  )
}

export default Providers
