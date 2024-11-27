import { Alert, Button, Check, Warning } from "@tape.xyz/winder";
import { memo, useMemo } from "react";
import type { Connector } from "wagmi";
import { useAccount, useConnect } from "wagmi";
import { AuthProviders } from "./auth-providers";
import { Authenticate } from "./authenticate";

export const ConnectWallet = memo(() => {
  //   const { addEventToQueue } = useSw();
  //   const { activeProfile } = useProfileStore();
  //   const handleWrongNetwork = useHandleWrongNetwork();

  const { connector: connected } = useAccount();
  const { connectors, connectAsync, isPending, error } = useConnect();

  const onChooseConnector = async (connector: Connector) => {
    try {
      //   await handleWrongNetwork();
      await connectAsync({ connector });
      //   addEventToQueue(EVENTS.AUTH.CONNECT_WALLET, { connector: connector.id });
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

  //   if (activeProfile?.id) {
  //     return <Authenticate />;
  //   }

  return (
    <div className="flex flex-col gap-6">
      <AuthProviders />
      <div className="flex items-center space-x-4">
        <div className="h-px flex-1 bg-secondary" />
        <span className="text-muted text-sm">or</span>
        <div className="h-px flex-1 bg-secondary" />
      </div>
      <div className="flex flex-col gap-2">
        {filteredConnectors.map((c) => (
          <Button
            key={c.id}
            variant="outline"
            className="h-11 px-3.5 font-normal"
            onClick={() => onChooseConnector(c)}
            disabled={c.id === connected?.id || isPending}
          >
            <div className="flex w-full items-center justify-between">
              <span>{getConnectorName(c)}</span>
              {c.id === connected?.id && <Check className="size-3" />}
            </div>
          </Button>
        ))}
      </div>
      <Authenticate />
      {error?.message ? (
        <Alert variant="destructive">
          <Warning className="size-4" />
          <span>{error?.message ?? "Failed to connect"}</span>
        </Alert>
      ) : null}
    </div>
  );
});
