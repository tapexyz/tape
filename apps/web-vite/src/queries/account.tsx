import { execute } from "@/helpers/execute";
import {
  queryOptions,
  useInfiniteQuery,
  useQuery
} from "@tanstack/react-query";
import {
  AccountDocument,
  AccountsAvailableDocument,
  LastLoggedInAccountDocument,
  PageSize
} from "@tape.xyz/indexer";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

export const useAccountsAvailableQuery = () => {
  const { address } = useAccount();
  return useInfiniteQuery({
    queryKey: ["accounts-available"],
    queryFn: ({ pageParam }) =>
      execute(AccountsAvailableDocument, {
        request: {
          managedBy: address,
          includeOwned: true,
          pageSize: PageSize.Fifty,
          cursor: pageParam
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
      execute(LastLoggedInAccountDocument, {
        request: {
          address
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
      execute(AccountDocument, {
        request
      })
  });
};

export const useAccountQuery = (handle: string) => {
  return useQuery(accountQuery(handle));
};
