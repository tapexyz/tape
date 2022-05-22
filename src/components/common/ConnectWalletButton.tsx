import useAppStore from "@lib/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
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
                  <button
                    onClick={openConnectModal}
                    className="px-3 py-[7px] whitespace-nowrap text-xs dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-100"
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="px-3 py-[7px] whitespace-nowrap text-white text-xs bg-red-500 rounded-lg"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <>
                  {token.refresh ? (
                    <UserMenu />
                  ) : (
                    <button
                      className={clsx(
                        "px-3 items-center space-x-2 flex py-[7px] text-xs border border-gray-200 dark:border-gray-800 rounded-lg",
                        {
                          "opacity-50": loading,
                          "dark:hover:bg-gray-800 hover:bg-gray-100": !loading,
                        }
                      )}
                      onClick={() => handleSign()}
                      disabled={loading}
                      type="button"
                    >
                      <span className="inline-flex items-center whitespace-nowrap">
                        Sign-in with Ethereum
                      </span>
                    </button>
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
