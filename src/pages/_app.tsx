import '../styles/index.css'

import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import { ALCHEMY_KEY, ALCHEMY_RPC_URL } from '@lib/store'
import { IS_MAINNET, POLYGON_CHAIN_ID } from '@utils/constants'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
  [alchemyProvider({ alchemyId: ALCHEMY_KEY })]
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
        rpc: { [POLYGON_CHAIN_ID]: ALCHEMY_RPC_URL }
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Lenstube',
        jsonRpcUrl: ALCHEMY_RPC_URL
      }
    })
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </WagmiConfig>
  )
}

export default MyApp
