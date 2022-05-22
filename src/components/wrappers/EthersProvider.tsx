import { ALCHEMY_KEY } from "@lib/store";
import {
  apiProvider,
  configureChains,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { FC, ReactNode } from "react";
import { chain, createClient, WagmiProvider } from "wagmi";

const { chains, provider } = configureChains(
  [chain.polygon, chain.polygonMumbai],
  [apiProvider.alchemy(ALCHEMY_KEY), apiProvider.fallback()]
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
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions
        theme={resolvedTheme === "dark" ? darkTheme() : lightTheme()}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

export default EthersProvider;
