import { execute } from "@/helpers/execute";
import { uploadJson } from "@/helpers/upload-json";
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
  AccountsAvailableDocument,
  CreateAccountWithUsernameDocument,
  LastLoggedInAccountDocument,
  MeDocument,
  PageSize
} from "@tape.xyz/indexer";
import { AUTH_CHALLENGE_TYPE } from "@tape.xyz/indexer/custom-types";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { useAuthenticateMutation } from "./auth";

export const useAccountsAvailableQuery = () => {
  const { address } = useAccount();
  return useInfiniteQuery({
    queryKey: ["accounts-available"],
    queryFn: ({ pageParam }) =>
      execute({
        query: AccountsAvailableDocument,
        variables: {
          request: {
            managedBy: address,
            includeOwned: true,
            pageSize: PageSize.Fifty,
            cursor: pageParam
          }
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.accountsAvailable.pageInfo.next,
    enabled: Boolean(address)
  });
};

export const useLastLoggedInAccountQuery = (address: string) => {
  return useQuery({
    queryKey: ["last-logged-in-account"],
    queryFn: () =>
      execute({
        query: LastLoggedInAccountDocument,
        variables: {
          request: {
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
                localName: input.username
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
