import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import {
  APP_NAME,
  GOOGLE_ANALYTICS_ID,
  IS_MAINNET,
  POLYGON_CHAIN_ID,
  POLYGON_RPC_URL
} from '@utils/constants'
import Script from 'next/script'
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
      {IS_MAINNET && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}', {
              page_path: window.location.pathname,
            });
            `}
          </Script>
        </>
      )}
    </WagmiConfig>
  )
}

export default Providers
