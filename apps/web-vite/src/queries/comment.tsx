import { execute } from "@/helpers/execute";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import {
  PageSize,
  PostReferenceType,
  PostReferencesDocument,
  PostVisibilityFilter
} from "@tape.xyz/indexer";

export const commentsQuery = (id: string) =>
  infiniteQueryOptions({
    queryKey: ["post-comments", id],
    queryFn: ({ pageParam }) =>
      execute({
        query: PostReferencesDocument,
        variables: {
          request: {
            referencedPost: id,
            referenceTypes: [PostReferenceType.CommentOn],
            visibilityFilter: PostVisibilityFilter.All,
            pageSize: PageSize.Fifty,
            cursor: pageParam
          }
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.postReferences.pageInfo.next
  });

export const useCommentsQuery = (id: string) =>
  useInfiniteQuery(commentsQuery(id));
