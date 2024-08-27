import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import {
  CommentRankingFilterType,
  CustomFiltersType,
  execute,
  LimitType,
  PublicationDocument,
  PublicationsDocument
} from '@tape.xyz/lens/gql'

export const publicationQuery = (id: string) =>
  queryOptions({
    queryKey: ['publication', id],
    queryFn: () =>
      execute(PublicationDocument, {
        request: {
          forId: id
        }
      })
  })

export const commentsQuery = (id: string) =>
  infiniteQueryOptions({
    queryKey: ['comments', id],
    queryFn: ({ pageParam }) =>
      execute(PublicationsDocument, {
        request: {
          where: {
            commentOn: {
              id,
              ranking: { filter: CommentRankingFilterType.Relevant }
            },
            customFilters: [CustomFiltersType.Gardeners]
          },
          limit: LimitType.Ten,
          cursor: pageParam
        }
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.publications.pageInfo.next
  })
