import { ButtonShimmer } from "@/components/shared/shimmers/button";
import { getAccountMetadata } from "@/helpers/metadata";
import { useAccountsAvailableQuery } from "@/queries/account";
import { useAuthenticateMutation } from "@/queries/auth";
import { signIn } from "@/store/cookie";
import { useNavigate } from "@tanstack/react-router";
import type { Account, AccountAvailable } from "@tape.xyz/indexer";
import { AUTH_CHALLENGE_TYPE } from "@tape.xyz/indexer/custom-types";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
  tw
} from "@tape.xyz/winder";
import { memo, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export const Authenticate = memo(() => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { data, isLoading: isAccountsLoading } = useAccountsAvailableQuery();

  const lastUsedAccount = data?.lastLoggedInAccount as Account;
  const accounts = data?.accountsAvailable.items as AccountAvailable[];
  const sortedAccounts = useMemo(() => {
    if (!accounts?.length) return [];
    return accounts.sort((a) =>
      a.account.address === lastUsedAccount?.address ? -1 : 1
    );
  }, [accounts, lastUsedAccount]);

  const [chosenAccount, setChosenAccount] = useState<AccountAvailable | null>(
    accounts?.[0] || null
  );

  const { mutateAsync: authenticate, isPending } = useAuthenticateMutation({
    type:
      chosenAccount?.__typename === "AccountOwned"
        ? AUTH_CHALLENGE_TYPE.ACCOUNT_OWNER
        : AUTH_CHALLENGE_TYPE.ACCOUNT_MANAGER,
    account: chosenAccount?.account.address as string
  });

  if (!isConnected) {
    return null;
  }

  const loading = isAccountsLoading;
  if (loading) {
    return (
      <div className="my-6 flex flex-col gap-2">
        <ButtonShimmer />
        <ButtonShimmer />
      </div>
    );
  }

  const siwe = async () => {
    const result = await authenticate();
    if (result.authenticate.__typename === "AuthenticationTokens") {
      const { accessToken, refreshToken, idToken } = result.authenticate;
      signIn({ accessToken, refreshToken, identityToken: idToken });
      return navigate({ to: "/" });
    }
    toast.error(result.authenticate.reason);
  };

  return (
    <div className={tw("flex items-center", sortedAccounts.length && "mb-6")}>
      {sortedAccounts.length ? (
        <div className="flex w-full flex-col gap-2">
          <Select
            value={chosenAccount?.account.address}
            onValueChange={(value) => {
              const account = sortedAccounts.find(
                (account) => account.account.address === value
              );
              setChosenAccount(account || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {sortedAccounts.map(({ account }) => {
                const { namespace, handle } = getAccountMetadata(account);
                return (
                  <SelectItem key={account.address} value={account.address}>
                    {namespace}/{handle}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button
            className="h-11 w-full"
            onClick={siwe}
            loading={isPending}
            disabled={!chosenAccount}
          >
            Sign in
          </Button>
        </div>
      ) : null}
    </div>
  );
});
