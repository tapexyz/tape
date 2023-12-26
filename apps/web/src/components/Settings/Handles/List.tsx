import type { HandleInfo, OwnedHandlesRequest } from '@tape.xyz/lens'

import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import { getIsProfileOwner } from '@tape.xyz/generic'
import { useOwnedHandlesQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { useAccount } from 'wagmi'

const List = () => {
  const { address } = useAccount()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const isOwner = activeProfile && getIsProfileOwner(activeProfile, address)

  const request: OwnedHandlesRequest = { for: address }
  const { data, error, fetchMore, loading } = useOwnedHandlesQuery({
    skip: !isOwner || !address,
    variables: {
      request
    }
  })
  const ownedHandles = data?.ownedHandles.items as HandleInfo[]
  const pageInfo = data?.ownedHandles.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    threshold: 0.25
  })

  if (!isOwner) {
    return null
  }

  return (
    <div>
      {loading && <Loader className="my-10" />}
      {(!loading && !ownedHandles?.length) || error ? (
        <NoDataFound isCenter withImage />
      ) : null}
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
        {ownedHandles?.map((handle) => (
          <div
            className="tape-border rounded-small flex items-center space-x-2 p-5"
            key={handle.id}
          >
            <div className="flex flex-col">
              <Link
                className="line-clamp-1 font-semibold"
                href={`/u/${handle.fullHandle}`}
              >
                {handle.fullHandle}
              </Link>
              <p>{handle.linkedTo?.nftTokenId ?? 'No profile attached'}</p>
            </div>
          </div>
        ))}
        {pageInfo?.next && (
          <span className="flex justify-center p-10" ref={observe}>
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}

export default List
