import '../styles/index.css'

import { ApolloProvider } from '@apollo/client'
import Layout from '@components/Common/Layout'
import apolloClient from '@lib/apollo'
import usePersistStore from '@lib/store/persist'
import {
  ALCHEMY_KEY,
  AUTH_ROUTES,
  GOOGLE_ANALYTICS_ID,
  IS_MAINNET,
  POLYGON_CHAIN_ID,
  POLYGON_RPC_URL
} from '@utils/constants'
import { AUTH } from '@utils/url-path'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'

export { reportWebVitals } from 'next-axiom'

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai, chain.mainnet],
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
        rpc: { [POLYGON_CHAIN_ID]: POLYGON_RPC_URL }
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Lenstube',
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

const App = ({ Component, pageProps }: AppProps) => {
  const { isAuthenticated } = usePersistStore()
  const { pathname, replace, asPath } = useRouter()

  useEffect(() => {
    if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      replace(`${AUTH}?next=${asPath}`)
    }
  }, [isAuthenticated, pathname, asPath, replace])

  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <Layout>
            <Component {...pageProps} />
          </Layout>
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

export default App
