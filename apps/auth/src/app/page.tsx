'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL,
  POLYGON_RPC_URL,
  WC_PROJECT_ID
} from '@lenstube/constants'
import { apolloClient, ApolloProvider } from '@lenstube/lens/apollo'
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import React from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import Auth from '@/components/Auth'
import Header from '@/components/Header'

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: POLYGON_RPC_URL
      })
    })
  ]
)

const { connectors } = getDefaultWallets({
  appName: LENSTUBE_APP_NAME,
  projectId: WC_PROJECT_ID,
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const Disclaimer = () => (
  <div className="text-[10px]">
    <span>By continuing, you agree to Lenstube's</span>{' '}
    <a href="/terms" className="text-indigo-300" target="_blank">
      terms
    </a>{' '}
    <span>and</span>{' '}
    <a href="/privacy" className="text-indigo-300" target="_blank">
      privacy policy
    </a>
    .
  </div>
)

const Home = () => {
  return (
    <ApolloProvider client={apolloClient()}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          appInfo={{
            appName: LENSTUBE_APP_NAME,
            learnMoreUrl: LENSTUBE_WEBSITE_URL,
            disclaimer: () => <Disclaimer />
          }}
          modalSize="compact"
          chains={chains}
          theme={darkTheme({
            fontStack: 'system',
            overlayBlur: 'small',
            accentColor: '#6366f1'
          })}
        >
          <Header />
          <Auth />
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  )
}

export default Home
