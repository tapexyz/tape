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
      execute(PostReferencesDocument, {
        request: {
          referencedPost: id,
          referenceTypes: [PostReferenceType.CommentOn],
          visibilityFilter: PostVisibilityFilter.All,
          pageSize: PageSize.Fifty,
          cursor: pageParam
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.postReferences.pageInfo.next
  });

export const useCommentsQuery = (id: string) => {
  return useInfiniteQuery(commentsQuery(id));
};
