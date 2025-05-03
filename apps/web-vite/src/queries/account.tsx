import { execute } from "@/helpers/execute";
import { uploadJson } from "@/helpers/upload";
import { useAccountStore } from "@/store/account";
import { isAuthenticated } from "@/store/cookie";
import { account } from "@lens-protocol/metadata";
import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useSuspenseQuery
} from "@tanstack/react-query";
import {
  AccountDocument,
  AccountStatsDocument,
  AccountsAvailableDocument,
  CreateAccountWithUsernameDocument,
  FollowersYouKnowDocument,
  MeDocument,
  PageSize
} from "@tape.xyz/indexer";
import { AUTH_CHALLENGE_TYPE } from "@tape.xyz/indexer/custom-types";
import { type Address, isAddress } from "viem";
import { useAccount } from "wagmi";
import { useAuthenticateMutation } from "./auth";

export const useAccountsAvailableQuery = () => {
  const { address } = useAccount();
  return useQuery({
    queryKey: ["accounts-available", address],
    queryFn: () =>
      execute({
        query: AccountsAvailableDocument,
        variables: {
          accountsAvailableRequest: {
            managedBy: address,
            includeOwned: true,
            pageSize: PageSize.Fifty
          },
          lastLoggedInAccountRequest: {
            address
          }
        }
      }),
    enabled: Boolean(address)
  });
};

export const accountQuery = (handle: string) => {
  const request = isAddress(handle)
    ? { address: handle }
    : { username: { localName: handle } };

  return queryOptions({
    queryKey: ["account", handle],
    queryFn: () =>
      execute({
        query: AccountDocument,
        variables: {
          request
        }
      })
  });
};
export const useAccountQuery = (handle: string) =>
  useQuery(accountQuery(handle));
export const useAccountSuspenseQuery = (handle: string) =>
  useSuspenseQuery(accountQuery(handle));

export const meQuery = queryOptions({
  queryKey: ["me"],
  queryFn: () =>
    execute({
      query: MeDocument,
      variables: {}
    }),
  enabled: isAuthenticated()
});

export const useMeSuspenseQuery = () => useSuspenseQuery(meQuery);

export const useAccountStatsQuery = (address: Address) => {
  return useQuery({
    queryKey: ["account-stats", address],
    queryFn: () =>
      execute({
        query: AccountStatsDocument,
        variables: { request: { account: address } }
      })
  });
};

export const useFollowersYouKnowInfiniteQuery = (target: Address) => {
  const { currentAccount } = useAccountStore();
  return useInfiniteQuery({
    queryKey: ["followers-you-know", currentAccount, target],
    queryFn: () =>
      execute({
        query: FollowersYouKnowDocument,
        variables: {
          request: {
            observer: currentAccount?.address,
            target,
            pageSize: PageSize.Ten
          }
        }
      }),
    enabled: Boolean(currentAccount?.address),
    getNextPageParam: (lastPage) => lastPage.followersYouKnow.pageInfo.next,
    initialPageParam: 0
  });
};

export const useCreateAccountMutation = () => {
  const { mutateAsync: authenticate } = useAuthenticateMutation({
    type: AUTH_CHALLENGE_TYPE.ONBOARDING_USER
  });

  return useMutation({
    mutationFn: async (input: { username: string }) => {
      const result = await authenticate();
      if (result.authenticate.__typename === "AuthenticationTokens") {
        const { accessToken } = result.authenticate;

        const metadata = account({ name: input.username });
        const { uri } = await uploadJson(metadata);

        return execute({
          query: CreateAccountWithUsernameDocument,
          variables: {
            request: {
              metadataUri: uri,
              username: {
                localName: input.username.toLowerCase()
              }
            }
          },
          context: {
            headers: {
              "x-access-token": `Bearer ${accessToken}`
            }
          }
        });
      }
    }
  });
};
