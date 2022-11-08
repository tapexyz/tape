import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { APP_NAME, IS_MAINNET, POLYGON_RPC_URL } from '@utils/constants'
import { ThemeProvider, useTheme } from 'next-themes'
import React, { ReactNode } from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai, chain.mainnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: POLYGON_RPC_URL
      })
    })
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      coinbaseWallet({ appName: APP_NAME, chains }),
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
  return (
    <RainbowKitProvider
      modalSize="compact"
      chains={chains}
      theme={theme === 'dark' ? darkTheme() : lightTheme()}
    >
      {children}
    </RainbowKitProvider>
  )
}

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <RainbowKitProviderWrapper>
          <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
        </RainbowKitProviderWrapper>
      </ThemeProvider>
    </WagmiConfig>
  )
}

export default Providers
