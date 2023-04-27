import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import { loadLocale } from '@lib/i18n'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { LivepeerConfig } from '@livepeer/react'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'
import { IS_MAINNET, LENSTUBE_APP_NAME, POLYGON_RPC_URL } from 'utils'
import { getLivepeerClient, videoPlayerTheme } from 'utils/functions/livepeer'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import ErrorBoundary from '../ErrorBoundary'

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: POLYGON_RPC_URL
      })
    }),
    publicProvider()
  ],
  { targetQuorum: 1 }
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true }),
      braveWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      ledgerWallet({ chains }),
      coinbaseWallet({ appName: LENSTUBE_APP_NAME, chains }),
      walletConnectWallet({ chains })
    ]
  }
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

// Enables usage of theme in RainbowKitProvider
const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  const themeOptions: ThemeOptions = {
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#6366f1'
  }
  return (
    <RainbowKitProvider
      modalSize="compact"
      chains={chains}
      theme={
        theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
      }
    >
      {children}
    </RainbowKitProvider>
  )
}

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    loadLocale()
  }, [])

  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary>
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <WagmiConfig client={wagmiClient}>
            <ThemeProvider defaultTheme="dark" attribute="class">
              <RainbowKitProviderWrapper>
                <ApolloProvider client={apolloClient}>
                  {children}
                </ApolloProvider>
              </RainbowKitProviderWrapper>
            </ThemeProvider>
          </WagmiConfig>
        </LivepeerConfig>
      </ErrorBoundary>
    </I18nProvider>
  )
}

export default Providers
