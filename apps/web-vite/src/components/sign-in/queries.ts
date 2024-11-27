import { execute } from "@/helpers/execute";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  AccountsAvailableDocument,
  LastLoggedInAccountDocument,
  PageSize
} from "@tape.xyz/indexer";

export const accountsAvailableQuery = (managedBy: string) =>
  infiniteQueryOptions({
    queryKey: ["accounts-available"],
    queryFn: ({ pageParam }) =>
      execute(AccountsAvailableDocument, {
        request: {
          managedBy,
          includeOwned: true,
          pageSize: PageSize.Fifty,
          cursor: pageParam
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.accountsAvailable.pageInfo.next,
    enabled: Boolean(managedBy)
  });

export const lastLoggedInAccountQuery = (address: string) =>
  queryOptions({
    queryKey: ["last-logged-in-account"],
    queryFn: () =>
      execute(LastLoggedInAccountDocument, {
        request: {
          address
        }
      }),
    enabled: Boolean(address)
  });
