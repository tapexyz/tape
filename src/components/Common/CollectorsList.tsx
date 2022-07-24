import { useQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import { VIDEO_COLLECTORS_QUERY } from '@utils/gql/queries'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import { PaginatedResultInfo, Wallet } from 'src/types'

import { AddressExplorerLink } from './ExplorerLink'

type Props = {
  videoId: string
}

const CollectorsList: FC<Props> = ({ videoId }) => {
  const [collectors, setCollectors] = useState<Wallet[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, fetchMore } = useQuery(VIDEO_COLLECTORS_QUERY, {
    variables: { request: { publicationId: videoId, limit: 10 } },
    skip: !videoId,
    onCompleted(data) {
      setPageInfo(data?.whoCollectedPublication?.pageInfo)
      setCollectors(data?.whoCollectedPublication?.items)
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
              limit: 10
            }
          }
        })
        setPageInfo(data?.whoCollectedPublication?.pageInfo)
        setCollectors([...collectors, ...data?.whoCollectedPublication?.items])
      } catch (error) {
        logger.error('[Error Fetch Collectors]', error)
      }
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
            <Link href={`/${wallet?.defaultProfile?.handle}`}>
              <a className="flex items-center justify-between font-base">
                <div className="flex items-center space-x-1.5">
                  <img
                    className="w-5 h-5 rounded"
                    src={getProfilePicture(wallet?.defaultProfile, 'avatar')}
                    alt="channel picture"
                    draggable={false}
                  />
                  <div>{wallet?.defaultProfile?.handle}</div>
                </div>
                <div className="flex items-center space-x-1 text-xs whitespace-nowrap opacity-80">
                  <BiUser />
                  <span>{wallet.defaultProfile.stats.totalFollowers}</span>
                </div>
              </a>
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
