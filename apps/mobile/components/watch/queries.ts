import { execute } from "@/helpers/execute";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  PublicationDocument,
  PublicationMetadataMainFocusType,
  PublicationsDocument
} from "@tape.xyz/lens/gql";

export const publicationQuery = (id: string) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () =>
      execute(PublicationDocument, {
        request: {
          forId: id
        }
      })
  });

export const commentsQuery = (id: string) =>
  infiniteQueryOptions({
    queryKey: ["comments", id],
    queryFn: ({ pageParam }) =>
      execute(PublicationsDocument, {
        request: {
          where: {
            commentOn: {
              id,
              ranking: { filter: CommentRankingFilterType.Relevant }
            },
            metadata: {
              mainContentFocus: [PublicationMetadataMainFocusType.TextOnly]
            },
            customFilters: [CustomFiltersType.Gardeners]
          },
          limit: LimitType.Ten,
          cursor: pageParam
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.publications.pageInfo.next
  });
