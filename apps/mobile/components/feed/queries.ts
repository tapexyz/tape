import { execute } from "@/helpers/execute";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { FeedDocument, FeedEventItemType } from "@tape.xyz/indexer";

export const feedQuery = (profileId: string) =>
  infiniteQueryOptions({
    queryKey: ["feed", profileId],
    queryFn: ({ pageParam }) =>
      execute(FeedDocument, {
        request: {
          where: {
            feedEventItemTypes: [FeedEventItemType.Post],
            for: profileId
          },
          cursor: pageParam
        }
      }),
    enabled: Boolean(profileId),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.feed.pageInfo.next
  });
