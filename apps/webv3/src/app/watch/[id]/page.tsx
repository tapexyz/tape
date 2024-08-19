import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

import { rqClient } from '@/app/providers/react-query'
import { Comments } from '@/components/watch/comments'
import { Publication } from '@/components/watch/publication'
import { publicationQuery } from '@/components/watch/query'

type Params = {
  id: string
}

export default function WatchPage({ params }: { params: Params }) {
  void rqClient.prefetchQuery(publicationQuery(params.id))

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Publication />
      </HydrationBoundary>
      <Suspense fallback={'loading...'}>
        <p>Comments</p>
        <Comments id={params.id} />
      </Suspense>
    </div>
  )
}
