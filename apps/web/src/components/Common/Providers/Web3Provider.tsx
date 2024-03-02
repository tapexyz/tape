import { WC_PROJECT_ID } from '@dragverse/constants'
import { type FC, type ReactNode } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const connectors = [
  injected(),
  // TODO: showQrModal: false is a temporary fix for the issue with WalletConnect
  walletConnect({ projectId: WC_PROJECT_ID, showQrModal: false })
  // TODO: commented until this error is fixed: ReferenceError: localStorage is not defined
  // coinbaseWallet({ appName: TAPE_APP_NAME })
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
