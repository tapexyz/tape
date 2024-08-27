'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens/gql'
import { useParams } from 'next/navigation'

import { commentsQuery } from '../queries'

export const Comments = () => {
  const { pubId } = useParams<{ pubId: string }>()
  const { data, isLoading } = useInfiniteQuery(commentsQuery(pubId))

  return (
    <div>
      <p>Comments</p>
      {isLoading && <div>Loading...</div>}
      {data?.pages[0].publications.items.length === 0 && <b>No comments</b>}
      {data?.pages.map((page) =>
        page.publications.items.map(
          (item) => getPublication(item as AnyPublication).metadata.content
        )
      )}
    </div>
  )
}
