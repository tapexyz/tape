import { TAPE_APP_NAME, WC_PROJECT_ID } from '@tape.xyz/constants'
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { LedgerConnector } from '@wagmi/connectors/ledger'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'
import { type FC, type ReactNode } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [
    polygon,
    polygonMumbai,
    mainnet,
    goerli,
    zora,
    zoraTestnet,
    optimism,
    optimismGoerli,
    base,
    baseGoerli
  ],
  [publicProvider()]
)

const connectors: any = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({ options: { appName: TAPE_APP_NAME } }),
  new WalletConnectConnector({
    options: {
      projectId: WC_PROJECT_ID
    },
    chains
  }),
  new LedgerConnector({
    chains,
    options: {
      projectId: WC_PROJECT_ID
    }
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
