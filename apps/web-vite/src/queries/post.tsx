import { execute } from "@/helpers/execute";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery
} from "@tanstack/react-query";
import {
  MainContentFocus,
  PageSize,
  PostDocument,
  PostType,
  PostsDocument
} from "@tape.xyz/indexer";

export const postQuery = (id: string) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () =>
      execute(PostDocument, {
        request: {
          post: id
        }
      })
  });

export const usePostQuery = (id: string) => {
  return useQuery(postQuery(id));
};
export const usePostSuspenseQuery = (id: string) => {
  return useSuspenseQuery(postQuery(id));
};

export const postsQuery = infiniteQueryOptions({
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

export const usePostsQuery = () => {
  return useInfiniteQuery(postsQuery);
};

export const bytesQuery = infiniteQueryOptions({
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

export const useBytesQuery = () => {
  return useInfiniteQuery(bytesQuery);
};
export const useBytesSuspenseQuery = () => {
  return useSuspenseInfiniteQuery(bytesQuery);
};
