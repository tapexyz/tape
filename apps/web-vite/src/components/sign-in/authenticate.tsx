import { ButtonShimmer } from "@/components/shared/shimmers/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Account, AccountAvailable } from "@tape.xyz/indexer";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@tape.xyz/winder";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { accountsAvailableQuery, lastLoggedInAccountQuery } from "./queries";

export const Authenticate = () => {
  //   const [loading, setLoading] = useState(false);
  //   const [showSignup, setShowSignup] = useState(false);
  const [chosenAccount, setChosenAccount] = useState<string>("");
  //   const { activeProfile, setActiveProfile } = useProfileStore();
  //   const { addEventToQueue } = useSw();

  const { address, isConnected } = useAccount();
  const { data, isLoading: isAccountsLoading } = useInfiniteQuery(
    accountsAvailableQuery(address as string)
  );
  const {
    data: lastLoggedInAccountData,
    isLoading: isLastLoggedInAccountLoading
  } = useQuery(lastLoggedInAccountQuery(address as string));

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

  if (!isConnected) {
    return null;
  }

  if (isAccountsLoading || isLastLoggedInAccountLoading) {
    return <ButtonShimmer />;
  }

  const signIn = () => {
    console.log("sign in", chosenAccount);
  };

  return (
    <div className="flex items-center">
      {sortedAccounts.length ? (
        <div className="flex w-full flex-col gap-2">
          <Select
            defaultValue={sortedAccounts[0]?.account.address}
            value={chosenAccount}
            onValueChange={(value) => setChosenAccount(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {sortedAccounts?.map(({ account }) => (
                <SelectItem key={account.address} value={account.address}>
                  {account.username?.namespace.namespace}/
                  {account.username?.localName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="h-11 w-full" onClick={signIn}>
            Sign in
          </Button>
        </div>
      ) : null}

      {/* <div className="flex flex-col gap-2">
        {profiles[0] ? (
          <>
            <Select
              size="lg"
              defaultValue={as ?? profiles[0].id}
              value={selectedProfileId}
              onValueChange={(value) => setSelectedProfileId(value)}
            >
              {profiles?.map((profile) => (
                <SelectItem size="lg" key={profile.id} value={profile.id}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={getProfilePicture(profile, "AVATAR")}
                      className="size-4 rounded-full"
                      onError={({ currentTarget }) => {
                        currentTarget.src = getLennyPicture(profile?.id);
                      }}
                      alt={getProfile(profile)?.displayName}
                    />
                    <span>{getProfile(profile).slugWithPrefix}</span>
                    <Badge id={profile?.id} size="xs" />
                  </div>
                </SelectItem>
              ))}
            </Select>
            <Button
              size="md"
              loading={loading}
              onClick={handleSign}
              disabled={loading || !selectedProfileId}
            >
              Login
            </Button>
          </>
        ) : (
          <Callout
            variant="danger"
            icon={<WarningOutline className="size-4" />}
          >
            We could&apos;nt find any profiles linked to the connected address.
            ({shortenAddress(address as string)})
          </Callout>
        )}
        <div className="flex items-center justify-center space-x-2 pt-3 text-sm">
          {profiles[0] ? (
            <span>Need new account?</span>
          ) : (
            <span>Don&apos;t have an account?</span>
          )}
          <button
            type="button"
            className="font-bold text-brand-500"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </button>
        </div>
      </div> */}
    </div>
  );
};
