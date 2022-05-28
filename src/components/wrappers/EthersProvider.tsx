import { ALCHEMY_KEY } from "@lib/store";
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { FC, ReactNode } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider({ alchemyId: ALCHEMY_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "LensTube",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

interface Props {
  children: ReactNode;
}

const EthersProvider: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions
        theme={resolvedTheme === "dark" ? darkTheme() : lightTheme()}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default EthersProvider;
