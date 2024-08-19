'use client'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens/gql'
import Link from 'next/link'

import { publicationsQuery } from './query'

export const Feed = () => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(publicationsQuery)

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.publications.items.map((item, j) => {
            const anyPublication = item as AnyPublication
            const publication = getPublication(anyPublication)
            return (
              <div key={publication.id}>
                <Link href={`/watch/${publication.id}`}>
                  ({(i + 1) * (j + 1)}) {publication.id}
                </Link>
              </div>
            )
          })}
        </div>
      ))}
      {isFetchingNextPage && <div>Loading...</div>}
      {hasNextPage && (
        <button
          className="mt-5 bg-gray-200 px-2"
          onClick={() => fetchNextPage()}
        >
          Next
        </button>
      )}
    </div>
  )
}
