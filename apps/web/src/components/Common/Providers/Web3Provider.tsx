import {
  EXPLORER_RECOMMENDED_WALLET_IDS,
  TAPE_APP_NAME,
  WC_PROJECT_ID
} from '@tape.xyz/constants'
import { type FC, type ReactNode } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const connectors = [
  injected(),
  coinbaseWallet({ appName: TAPE_APP_NAME }),
  walletConnect({
    projectId: WC_PROJECT_ID,
    qrModalOptions: {
      explorerExcludedWalletIds: 'ALL',
      explorerRecommendedWalletIds: EXPLORER_RECOMMENDED_WALLET_IDS
    }
  })
]

const wagmiConfig = createConfig({
  connectors,
  chains: [polygon, polygonMumbai],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http()
  }
})

type Props = {
  children: ReactNode
}

const Web3Provider: FC<Props> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}

export default Web3Provider
