import { useQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { formatNumber } from '@utils/functions/formatNumber'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import type { PaginatedResultInfo, Wallet } from 'src/types/lens'
import { CollectorsDocument } from 'src/types/lens'

import IsVerified from './IsVerified'
import AddressExplorerLink from './Links/AddressExplorerLink'

type Props = {
  videoId: string
}

const CollectorsList: FC<Props> = ({ videoId }) => {
  const [collectors, setCollectors] = useState<Wallet[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, fetchMore } = useQuery(CollectorsDocument, {
    variables: { request: { publicationId: videoId, limit: 10 } },
    skip: !videoId,
    onCompleted(data) {
      setPageInfo(data?.whoCollectedPublication?.pageInfo)
      setCollectors(data?.whoCollectedPublication?.items as Wallet[])
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              publicationId: videoId,
              cursor: pageInfo?.next,
              limit: 30
            }
          }
        })
        setPageInfo(data?.whoCollectedPublication?.pageInfo)
        setCollectors([
          ...collectors,
          ...(data?.whoCollectedPublication?.items as Wallet[])
        ])
      } catch {}
    }
  })

  if (loading) return <Loader />
  if (data?.whoCollectedPublication?.items?.length === 0)
    return (
      <div className="pt-5">
        <NoDataFound text="No collectors yet" isCenter />
      </div>
    )

  return (
    <div className="mt-4 space-y-3">
      {collectors?.map((wallet: Wallet) => (
        <div className="flex flex-col" key={wallet.address}>
          {wallet?.defaultProfile ? (
            <Link
              href={`/${wallet?.defaultProfile?.handle}`}
              className="flex items-center justify-between font-base"
            >
              <div className="flex items-center space-x-1.5">
                <img
                  className="w-5 h-5 rounded"
                  src={getProfilePicture(wallet?.defaultProfile, 'avatar')}
                  alt="channel picture"
                  draggable={false}
                />
                <div className="flex items-center space-x-1">
                  <span>{wallet?.defaultProfile?.handle}</span>
                  <IsVerified id={wallet?.defaultProfile?.id} size="xs" />
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs whitespace-nowrap opacity-80">
                <BiUser />
                <span>
                  {formatNumber(wallet.defaultProfile.stats.totalFollowers)}
                </span>
              </div>
            </Link>
          ) : (
            <AddressExplorerLink address={wallet?.address}>
              <div className="flex items-center space-x-1.5 font-base">
                <img
                  className="w-5 h-5 rounded"
                  src={imageCdn(
                    getRandomProfilePicture(wallet.address),
                    'avatar'
                  )}
                  alt="channel picture"
                  draggable={false}
                />
                <div>{shortenAddress(wallet?.address)}</div>
              </div>
            </AddressExplorerLink>
          )}
        </div>
      ))}
      {pageInfo?.next && collectors.length !== pageInfo?.totalCount && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default CollectorsList
