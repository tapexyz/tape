import { NoDataFound } from '@components/UIElements/NoDataFound'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import type { HandleInfo, OwnedHandlesRequest } from '@tape.xyz/lens'
import { useOwnedHandlesQuery } from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { useAccount } from 'wagmi'

const List = () => {
  const { address } = useAccount()

  const request: OwnedHandlesRequest = { for: address }
  const { data, loading, error, fetchMore } = useOwnedHandlesQuery({
    variables: {
      request
    },
    skip: !address
  })
  const ownedHandles = data?.ownedHandles.items as HandleInfo[]
  const pageInfo = data?.ownedHandles.pageInfo

  const { observe } = useInView({
    threshold: 0.25,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  return (
    <div>
      {loading && <Spinner className="my-10" />}
      {(!loading && !ownedHandles?.length) || error ? (
        <NoDataFound withImage isCenter />
      ) : null}
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
        {ownedHandles?.map((handle) => (
          <div
            key={handle.id}
            className="tape-border rounded-small flex items-center space-x-2 p-5"
          >
            <div className="flex flex-col">
              <Link
                href={`/u/${handle.fullHandle}`}
                className="line-clamp-1 font-semibold"
              >
                {handle.fullHandle}
              </Link>
              <p>{handle.linkedTo?.nftTokenId ?? 'No profile attached'}</p>
            </div>
          </div>
        ))}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Spinner />
          </span>
        )}
      </div>
    </div>
  )
}

export default List
