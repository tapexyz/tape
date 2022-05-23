import { Button } from "@components/ui/Button";
import useAppStore from "@lib/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

import UserMenu from "./UserMenu";

type Props = {
  handleSign: () => void;
  loading?: boolean;
};

const ConnectWalletButton = ({ handleSign, loading }: Props) => {
  const { token } = useAppStore();

  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openChainModal, openConnectModal }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !chain || !account) {
                return (
                  <Button onClick={openConnectModal}>Connect Wallet</Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="danger">
                    Wrong network
                  </Button>
                );
              }

              return (
                <>
                  {token.refresh ? (
                    <UserMenu />
                  ) : (
                    <Button
                      loading={loading}
                      onClick={() => handleSign()}
                      disabled={loading}
                    >
                      Sign-in with Ethereum
                    </Button>
                  )}
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
