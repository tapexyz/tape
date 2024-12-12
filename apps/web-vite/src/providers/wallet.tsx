import { chains } from "@lens-network/sdk/viem";
import {
  LENS_TESTNET_RPCS,
  TAPE_APP_NAME,
  WC_PROJECT_ID
} from "@tape.xyz/constants";
import type { FC, ReactNode } from "react";
import { http, WagmiProvider, createConfig, fallback } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const connectors = [
  injected(),
  coinbaseWallet({ appName: TAPE_APP_NAME }),
  walletConnect({ projectId: WC_PROJECT_ID })
];

const wagmiConfig = createConfig({
  connectors,
  chains: [chains.testnet],
  transports: {
    [chains.testnet.id]: fallback(LENS_TESTNET_RPCS.map((rpc) => http(rpc)))
  }
});

type Props = {
  children: ReactNode;
};

export const WalletProvider: FC<Props> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
