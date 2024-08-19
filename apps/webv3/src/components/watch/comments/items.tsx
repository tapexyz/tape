'use client'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens/gql'
import { useParams } from 'next/navigation'

import { commentsQuery } from '../query'

export const Items = () => {
  const { id } = useParams<{ id: string }>()

  const { data } = useSuspenseInfiniteQuery(commentsQuery(id))

  return (
    <div>
      {data.pages.length === 0 && <div>No comments</div>}
      {data.pages.map((page) =>
        page.publications.items.map(
          (item) => getPublication(item as AnyPublication).metadata.content
        )
      )}
    </div>
  )
}
