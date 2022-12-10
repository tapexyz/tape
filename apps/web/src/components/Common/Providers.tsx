import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import type { ThemeConfig } from '@livepeer/react'
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import React from 'react'
import {
  IS_MAINNET,
  LENSTUBE_APP_NAME,
  LIVEPEER_STUDIO_API_KEY,
  POLYGON_RPC_URL
} from 'utils'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import ErrorBoundary from './ErrorBoundary'

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
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
      rainbowWallet({ chains }),
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

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: LIVEPEER_STUDIO_API_KEY
  })
})

const playerTheme: ThemeConfig = {
  colors: {
    accent: '#fff',
    progressLeft: '#6366f1'
  },
  fonts: {
    display: 'Matter'
  },
  fontSizes: {
    timeFontSize: '12px'
  },
  space: {
    timeMarginX: '20px'
  },
  sizes: {
    iconButtonSize: '35px',
    loading: '30px',
    thumb: '7px',
    thumbActive: '7px',
    trackActive: '3px',
    trackInactive: '3px'
  }
}

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
  return (
    <ErrorBoundary>
      <LivepeerConfig client={livepeerClient} theme={playerTheme}>
        <WagmiConfig client={wagmiClient}>
          <ThemeProvider defaultTheme="light" attribute="class">
            <RainbowKitProviderWrapper>
              <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
            </RainbowKitProviderWrapper>
          </ThemeProvider>
        </WagmiConfig>
      </LivepeerConfig>
    </ErrorBoundary>
  )
}

export default Providers
