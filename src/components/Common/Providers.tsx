import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import {
  APP_NAME,
  IS_MAINNET,
  POLYGON_CHAIN_ID,
  POLYGON_RPC_URL
} from '@utils/constants'
import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
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

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        rpc: { [POLYGON_CHAIN_ID]: POLYGON_RPC_URL }
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: APP_NAME,
        jsonRpcUrl: POLYGON_RPC_URL
      }
    })
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider defaultTheme="light" attribute="class">
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </WagmiConfig>
  )
}

export default Providers
