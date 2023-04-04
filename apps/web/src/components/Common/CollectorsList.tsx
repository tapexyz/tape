import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import type { Wallet } from 'lens'
import { useCollectorsQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import { shortenAddress } from 'utils/functions/shortenAddress'

import UserOutline from './Icons/UserOutline'
import IsVerified from './IsVerified'
import AddressExplorerLink from './Links/AddressExplorerLink'

type Props = {
  videoId: string
}

const CollectorsList: FC<Props> = ({ videoId }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const request = { publicationId: videoId, limit: 30 }

  const { data, loading, fetchMore } = useCollectorsQuery({
    variables: { request },
    skip: !videoId
  })

  const collectors = data?.whoCollectedPublication?.items as Wallet[]
  const pageInfo = data?.whoCollectedPublication?.pageInfo

  const { pageLoading } = usePaginationLoading({
    ref: sectionRef,
    hasMore: !!pageInfo?.next,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
  })

  if (loading) {
    return <Loader />
  }
  if (collectors?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No collectors yet" isCenter />
      </div>
    )
  }

  return (
    <div ref={sectionRef} className="mt-4 space-y-3">
      {collectors?.map((wallet: Wallet) => (
        <div className="flex flex-col" key={wallet.address}>
          {wallet?.defaultProfile ? (
            <Link
              href={`/channel/${wallet?.defaultProfile?.handle}`}
              className="font-base flex items-center justify-between"
            >
              <div className="flex items-center space-x-1.5">
                <img
                  className="h-5 w-5 rounded"
                  src={getProfilePicture(wallet?.defaultProfile, 'avatar')}
                  alt={wallet.defaultProfile.handle}
                  draggable={false}
                />
                <div className="flex items-center space-x-1">
                  <span>{wallet?.defaultProfile?.handle}</span>
                  <IsVerified id={wallet?.defaultProfile?.id} size="xs" />
                </div>
              </div>
              <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
                <UserOutline className="h-2.5 w-2.5 opacity-60" />
                <span>
                  {formatNumber(wallet.defaultProfile.stats.totalFollowers)}
                </span>
              </div>
            </Link>
          ) : (
            <AddressExplorerLink address={wallet?.address}>
              <div className="font-base flex items-center space-x-1.5">
                <img
                  className="h-5 w-5 rounded"
                  src={imageCdn(
                    getRandomProfilePicture(wallet.address),
                    'avatar'
                  )}
                  alt={wallet.address.handle}
                  draggable={false}
                />
                <div>{shortenAddress(wallet?.address)}</div>
              </div>
            </AddressExplorerLink>
          )}
        </div>
      ))}
      {pageInfo?.next && pageLoading && (
        <span className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default CollectorsList
