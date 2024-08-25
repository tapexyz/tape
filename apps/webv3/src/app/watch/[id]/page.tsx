import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import {
  getPublication,
  getPublicationData,
  getThumbnailUrl
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import type { Metadata } from 'next'

import { rqClient } from '@/app/providers/react-query'
import { Comments } from '@/components/watch/comments'
import { Publication } from '@/components/watch/publication'
import { publicationQuery } from '@/components/watch/queries'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await rqClient.fetchQuery(publicationQuery(params.id))
  const publication = getPublication(data.publication as AnyPublication)
  const metadata = getPublicationData(
    getPublication(publication as AnyPublication).metadata
  )
  const poster = getThumbnailUrl(publication.metadata, true)

  return {
    title: metadata?.title,
    description: metadata?.content,
    openGraph: {
      images: [poster]
    }
  }
}

export default function WatchPage({ params }: Props) {
  void rqClient.prefetchQuery(publicationQuery(params.id))

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Publication />
      </HydrationBoundary>
      <Comments />
    </div>
  )
}
