import { WC_PROJECT_ID } from "@tape.xyz/constants";
import type { FC, ReactNode } from "react";
import type { Chain } from "viem";
import { http, WagmiProvider, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

const lensTestnet = {
  id: 37111,
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: { name: "Grass", symbol: "GRASS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lens.dev"] }
  },
  blockExplorers: {
    default: {
      name: "Lens Testnet Explorer",
      url: "https://block-explorer.testnet.lens.dev"
    }
  }
} as const satisfies Chain;

const connectors = [injected(), walletConnect({ projectId: WC_PROJECT_ID })];

const wagmiConfig = createConfig({
  connectors,
  chains: [lensTestnet],
  transports: {
    [lensTestnet.id]: http()
  }
});

type Props = {
  children: ReactNode;
};

export const WalletProvider: FC<Props> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
