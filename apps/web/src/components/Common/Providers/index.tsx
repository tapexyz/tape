import { getLivepeerClient, videoPlayerTheme } from '@lenstube/browser'
import {
  IS_MAINNET,
  LENSTUBE_APP_NAME,
  POLYGON_RPC_URL,
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
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import ErrorBoundary from '../ErrorBoundary'
import RainbowKit from './RainbowKit'

// TEMP: Duplicate to fix signTypedData_v4 issue. Remove once fixed on WC+WAGMI end.
const preferredChains = [
  IS_MAINNET ? polygon : polygonMumbai,
  IS_MAINNET ? polygon : polygonMumbai
]

const { chains, publicClient } = configureChains(preferredChains, [
  jsonRpcProvider({
    rpc: () => ({
      http: POLYGON_RPC_URL
    })
  })
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
            <ThemeProvider defaultTheme="dark" attribute="class">
              <RainbowKit chains={chains}>
                <ApolloProvider client={apolloClient(authLink)}>
                  {children}
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
