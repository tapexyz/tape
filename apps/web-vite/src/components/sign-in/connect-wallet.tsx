import {
  useAccountsAvailableQuery,
  useLastLoggedInAccountQuery
} from "@/queries/account";
import type { Account, AccountAvailable } from "@tape.xyz/indexer";
import { Alert, Button, Check, Warning } from "@tape.xyz/winder";
import { memo, useMemo } from "react";
import type { Connector } from "wagmi";
import { useAccount, useConnect } from "wagmi";
import { Authenticate } from "./authenticate";

export const ConnectWallet = memo(() => {
  const { address, connector } = useAccount();
  const { connectors, connectAsync, isPending, error } = useConnect();
  const { data, isLoading: isAccountsLoading } = useAccountsAvailableQuery();
  const {
    data: lastLoggedInAccountData,
    isLoading: isLastLoggedInAccountLoading
  } = useLastLoggedInAccountQuery(address as string);

  const lastUsedAccount =
    lastLoggedInAccountData?.lastLoggedInAccount as Account;
  const accounts = data?.pages.flatMap(
    (page) => page.accountsAvailable.items
  ) as AccountAvailable[];
  const sortedAccounts = useMemo(() => {
    if (!accounts?.length) return [];
    return accounts.sort((a) =>
      a.account.address === lastUsedAccount?.address ? -1 : 1
    );
  }, [accounts, lastUsedAccount]);

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
    <div className="flex flex-col gap-6">
      {/* <AuthProviders />
      <div className="flex items-center space-x-4">
        <div className="h-px flex-1 bg-secondary" />
        <span className="text-muted text-sm">or</span>
        <div className="h-px flex-1 bg-secondary" />
      </div> */}
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
      <Authenticate
        accounts={sortedAccounts}
        loading={isAccountsLoading || isLastLoggedInAccountLoading}
      />
      {error?.message ? (
        <Alert variant="destructive">
          <Warning className="size-4" />
          <span>{error?.message ?? "Failed to connect"}</span>
        </Alert>
      ) : null}
    </div>
  );
});
