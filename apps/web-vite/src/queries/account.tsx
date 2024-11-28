import { execute } from "@/helpers/execute";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  AccountsAvailableDocument,
  LastLoggedInAccountDocument,
  PageSize
} from "@tape.xyz/indexer";
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
