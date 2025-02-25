import { Button, Check } from "@tape.xyz/winder";
import { memo, useMemo } from "react";
import type { Connector } from "wagmi";
import { useAccount, useConnect } from "wagmi";

export const ConnectWallet = memo(() => {
  const { connector } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();

  const onChooseConnector = async (connector: Connector) => {
    try {
      await connectAsync({ connector });
    } catch {}
  };

  const getConnectorName = (connector: Connector) => {
    switch (connector.id) {
      case "injected":
        return "Browser Wallet";
      case "walletConnect":
        return "Other Wallets";
      default:
        return connector.name;
    }
  };

  const filteredConnectors = useMemo(() => {
    return connectors.filter(
      (connector, index, self) =>
        self.findIndex((c) => c.type === connector.type) === index
    );
  }, [connectors]);

  return (
    <div className="mb-6 flex flex-col">
      <div className="flex flex-col gap-2">
        {filteredConnectors.map((c) => (
          <Button
            key={c.id}
            variant="outline"
            className="h-11 px-3.5 font-normal"
            onClick={() => onChooseConnector(c)}
            disabled={c.id === connector?.id || isPending}
          >
            <div className="flex w-full items-center justify-between">
              <span>{getConnectorName(c)}</span>
              {c.id === connector?.id && <Check className="size-3" />}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
});
