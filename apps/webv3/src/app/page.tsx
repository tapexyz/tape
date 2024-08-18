import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { Feed } from '@/components/home/feed'
import { publicationsQuery } from '@/components/home/query'

import { rqClient } from './providers/react-query'

export default function HomePage() {
  void rqClient.prefetchQuery(publicationsQuery)

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Feed />
      </HydrationBoundary>
      {/* <Suspense fallback={'loading...'}>
        <PokemonRSC />
      </Suspense> */}
    </main>
  )
}
