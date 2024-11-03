import { execute } from "@/helpers/execute";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { FeedDocument, FeedEventItemType } from "@tape.xyz/lens/gql";

export const feedQuery = (profileId: string) =>
  infiniteQueryOptions({
    queryKey: ["feed"],
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
