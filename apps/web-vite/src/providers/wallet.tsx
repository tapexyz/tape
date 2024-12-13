import { chains } from "@lens-network/sdk/viem";
import {
  LENS_TESTNET_RPCS,
  TAPE_APP_NAME,
  WC_PROJECT_ID
} from "@tape.xyz/constants";
import type { FC, ReactNode } from "react";
import { http, WagmiProvider, createConfig, fallback } from "wagmi";

const getConnectors = async () => {
  const { injected } = await import("wagmi/connectors");
  const { coinbaseWallet } = await import("wagmi/connectors");
  const { walletConnect } = await import("wagmi/connectors");

  return [
    injected(),
    coinbaseWallet({ appName: TAPE_APP_NAME }),
    walletConnect({ projectId: WC_PROJECT_ID })
  ] as const;
};

const wagmiConfig = createConfig({
  connectors: await getConnectors(),
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
