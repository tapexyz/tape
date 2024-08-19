import { rqClient } from '@/app/providers/react-query'

import { commentsQuery } from '../query'
import { Items } from './items'

export const Comments = ({ id }: { id: string }) => {
  void rqClient.prefetchInfiniteQuery(commentsQuery(id))

  return <Items />
}
