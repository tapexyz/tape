import { execute } from "@/helpers/execute";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  MainContentFocus,
  PageSize,
  PostType,
  PostsDocument
} from "@tape.xyz/indexer";

export const usePostsQuery = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      execute(PostsDocument, {
        request: {
          filter: {
            postTypes: [PostType.Root],
            metadata: {
              mainContentFocus: [MainContentFocus.Video]
            }
          },
          pageSize: PageSize.Fifty,
          cursor: pageParam
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.posts.pageInfo.next
  });
};

export const useBytesQuery = () => {
  return useInfiniteQuery({
    queryKey: ["bytes"],
    queryFn: ({ pageParam }) =>
      execute(PostsDocument, {
        request: {
          filter: {
            postTypes: [PostType.Root],
            metadata: {
              mainContentFocus: [MainContentFocus.ShortVideo]
            }
          },
          pageSize: PageSize.Fifty,
          cursor: pageParam
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.posts.pageInfo.next
  });
};
