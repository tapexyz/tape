import { ButtonShimmer } from "@/components/shared/shimmers/button";
import { getAccountMetadata } from "@/helpers/metadata";
import { useLastLoggedInAccountQuery } from "@/queries/account";
import { useAccountsAvailableQuery } from "@/queries/account";
import { useAuthenticateMutation } from "@/queries/auth";
import { signIn } from "@/store/cookie";
import { useNavigate } from "@tanstack/react-router";
import type { Account, AccountAvailable } from "@tape.xyz/indexer";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast
} from "@tape.xyz/winder";
import { memo, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export const Authenticate = memo(() => {
  const { address } = useAccount();
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

  const firstAccountAddress = accounts[0]?.account.address as string;
  const [chosenAccount, setChosenAccount] = useState(firstAccountAddress);
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const { mutateAsync: authenticate, isPending } =
    useAuthenticateMutation(chosenAccount);

  if (!isConnected) {
    return null;
  }

  const loading = isAccountsLoading || isLastLoggedInAccountLoading;
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
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
    <div className="flex items-center">
      {sortedAccounts.length ? (
        <div className="flex w-full flex-col gap-2">
          <Select
            value={chosenAccount}
            onValueChange={(value) => setChosenAccount(value)}
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
          <Button className="h-11 w-full" onClick={siwe} loading={isPending}>
            Sign in
          </Button>
        </div>
      ) : null}
    </div>
  );
});
