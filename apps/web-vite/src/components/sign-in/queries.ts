import { execute } from "@/helpers/execute";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { AccountsAvailableDocument, PageSize } from "@tape.xyz/indexer";

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
