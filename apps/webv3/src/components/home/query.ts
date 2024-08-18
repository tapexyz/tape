import { queryOptions } from '@tanstack/react-query'
import {
  execute,
  ExplorePublicationsDocument,
  ExplorePublicationsOrderByType
} from '@tape.xyz/lens/gql'

export const publicationsQuery = queryOptions({
  queryKey: ['publications'],
  queryFn: () =>
    execute(ExplorePublicationsDocument, {
      request: {
        orderBy: ExplorePublicationsOrderByType.Latest
      }
    })
})
