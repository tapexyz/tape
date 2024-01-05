import {
  EXPLORER_RECOMMENDED_WALLET_IDS,
  IS_MAINNET,
  TAPE_APP_NAME,
  WC_PROJECT_ID
} from '@tape.xyz/constants'
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'
import { type FC, type ReactNode } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const preferredChains = [
  IS_MAINNET ? polygon : polygonMumbai,
  IS_MAINNET ? polygon : polygonMumbai
]

const { chains, publicClient } = configureChains(preferredChains, [
  publicProvider()
])

const connectors: any = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({ options: { appName: TAPE_APP_NAME } }),
  new WalletConnectConnector({
    options: {
      projectId: WC_PROJECT_ID,
      qrModalOptions: {
        explorerExcludedWalletIds: 'ALL',
        explorerRecommendedWalletIds: EXPLORER_RECOMMENDED_WALLET_IDS
      }
    },
    chains
  })
]

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

type Props = {
  children: ReactNode
}

const Web3Provider: FC<Props> = ({ children }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}

export default Web3Provider
