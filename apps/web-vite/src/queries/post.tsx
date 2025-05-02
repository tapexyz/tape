import { getUnixTimestampNDaysAgo } from "@/helpers/date-time";
import { execute } from "@/helpers/execute";
import { uploadJson } from "@/helpers/upload";
import type { AudioMetadata, VideoMetadata } from "@lens-protocol/metadata";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery
} from "@tanstack/react-query";
import {
  CreatePostDocument,
  MainContentFocus,
  MlPostsExploreDocument,
  PageSize,
  PostDocument,
  PostType,
  PostsDocument
} from "@tape.xyz/indexer";

export const postQuery = (id: string) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () =>
      execute({
        query: PostDocument,
        variables: {
          request: {
            post: id
          }
        }
      })
  });
export const usePostQuery = (id: string) => useQuery(postQuery(id));
export const usePostSuspenseQuery = (id: string) =>
  useSuspenseQuery(postQuery(id));

const since = getUnixTimestampNDaysAgo(30);

export const useMLPostsExploreQuery = () =>
  useInfiniteQuery({
    queryKey: ["ml-posts-explore"],
    queryFn: ({ pageParam }) =>
      execute({
        query: MlPostsExploreDocument,
        variables: {
          request: {
            filter: {
              metadata: {
                mainContentFocus: [MainContentFocus.Video]
              },
              since
            },
            pageSize: PageSize.Fifty,
            shuffle: true,
            cursor: pageParam
          }
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.mlPostsExplore.pageInfo.next
  });

export const usePostsQuery = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      execute({
        query: PostsDocument,
        variables: {
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
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.posts.pageInfo.next
  });

export const bytesQuery = infiniteQueryOptions({
  queryKey: ["bytes"],
  queryFn: ({ pageParam }) =>
    execute({
      query: PostsDocument,
      variables: {
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
      }
    }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage?.posts?.pageInfo?.next
});
export const useBytesQuery = () => useInfiniteQuery(bytesQuery);
export const useBytesSuspenseQuery = () => useSuspenseInfiniteQuery(bytesQuery);

export const useCreatePostMutation = () =>
  useMutation({
    mutationFn: async (metadata: VideoMetadata | AudioMetadata) => {
      const { uri } = await uploadJson(metadata);

      return execute({
        query: CreatePostDocument,
        variables: {
          request: {
            contentUri: uri
          }
        }
      });
    }
  });

export const useAccountPostsQuery = (address: string) =>
  useInfiniteQuery({
    queryKey: ["account-posts", address],
    queryFn: ({ pageParam }) =>
      execute({
        query: PostsDocument,
        variables: {
          request: {
            filter: {
              postTypes: [PostType.Root],
              metadata: {
                mainContentFocus: [MainContentFocus.Video]
              },
              authors: [address]
            },
            pageSize: PageSize.Fifty,
            cursor: pageParam
          }
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.posts.pageInfo.next
  });

export const useAccountBytesQuery = (address: string) =>
  useInfiniteQuery({
    queryKey: ["account-bytes", address],
    queryFn: ({ pageParam }) =>
      execute({
        query: PostsDocument,
        variables: {
          request: {
            filter: {
              postTypes: [PostType.Root],
              metadata: {
                mainContentFocus: [MainContentFocus.ShortVideo]
              },
              authors: [address]
            },
            pageSize: PageSize.Fifty,
            cursor: pageParam
          }
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.posts.pageInfo.next
  });
