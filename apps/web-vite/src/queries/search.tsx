import { execute } from "@/helpers/execute";
import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  MainContentFocus,
  PageSize,
  PostType,
  SearchDocument
} from "@tape.xyz/indexer";

export const searchQuery = (keyword: string) =>
  queryOptions({
    queryKey: ["search", keyword],
    queryFn: () =>
      execute({
        query: SearchDocument,
        variables: {
          postsRequest: {
            filter: {
              searchQuery: keyword,
              postTypes: [PostType.Root],
              metadata: {
                mainContentFocus: [
                  MainContentFocus.Video,
                  MainContentFocus.ShortVideo,
                  MainContentFocus.Audio,
                  MainContentFocus.Livestream
                ]
              }
            },
            pageSize: PageSize.Ten
          },
          accountsRequest: {
            filter: {
              searchBy: {
                localNameQuery: keyword
              }
            },
            pageSize: PageSize.Ten
          }
        }
      }),
    enabled: Boolean(keyword)
  });

export const useSearchQuery = (keyword: string) =>
  useQuery(searchQuery(keyword));
