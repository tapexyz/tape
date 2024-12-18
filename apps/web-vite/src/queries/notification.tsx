import { execute } from "@/helpers/execute";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { NotificationsDocument } from "@tape.xyz/indexer";

export const notificationsQuery = infiniteQueryOptions({
  queryKey: ["notifications"],
  queryFn: ({ pageParam }) =>
    execute(NotificationsDocument, {
      request: {
        cursor: pageParam
      }
    }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.notifications.pageInfo.next
});
export const useNotificationsQuery = () => useInfiniteQuery(notificationsQuery);
