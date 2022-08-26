import { useQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { CHANNEL_SUBSCRIBERS_QUERY } from '@gql/queries'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import { Follower, PaginatedResultInfo, Profile } from 'src/types'

import { AddressExplorerLink } from './ExplorerLink'
import IsVerified from './IsVerified'

type Props = {
  channel: Profile
}

const SubscribersList: FC<Props> = ({ channel }) => {
  const [subscribers, setSubscribers] = useState<Follower[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, fetchMore } = useQuery(CHANNEL_SUBSCRIBERS_QUERY, {
    variables: { request: { profileId: channel?.id, limit: 10 } },
    skip: !channel?.id,
    onCompleted(data) {
      setPageInfo(data?.followers?.pageInfo)
      setSubscribers(data?.followers?.items)
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            profileId: channel?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
      setPageInfo(data?.followers?.pageInfo)
      setSubscribers([...subscribers, ...data?.followers?.items])
    }
  })

  if (loading) return <Loader />
  if (data?.followers?.items?.length === 0)
    return (
      <div className="pt-5">
        <NoDataFound text="No subscribers" isCenter />
      </div>
    )

  return (
    <div className="mt-4 space-y-3">
      {subscribers?.map((subscriber: Follower) => (
        <div className="flex flex-col" key={subscriber.wallet.address}>
          {subscriber.wallet?.defaultProfile ? (
            <Link href={`/${subscriber.wallet?.defaultProfile?.handle}`}>
              <a className="flex items-center justify-between font-base">
                <div className="flex items-center space-x-1.5">
                  <img
                    className="w-5 h-5 rounded"
                    src={getProfilePicture(
                      subscriber.wallet?.defaultProfile,
                      'avatar'
                    )}
                    alt="channel picture"
                    draggable={false}
                  />
                  <div className="flex items-center space-x-1">
                    <span>{subscriber.wallet?.defaultProfile?.handle}</span>
                    <IsVerified
                      id={subscriber.wallet?.defaultProfile?.id}
                      size="xs"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs whitespace-nowrap opacity-80">
                  <BiUser />
                  <span>
                    {subscriber.wallet.defaultProfile.stats.totalFollowers}
                  </span>
                </div>
              </a>
            </Link>
          ) : (
            <AddressExplorerLink address={subscriber.wallet?.address}>
              <div className="flex items-center space-x-1.5 font-base">
                <img
                  className="w-5 h-5 rounded"
                  src={imageCdn(
                    getRandomProfilePicture(subscriber.wallet.address),
                    'avatar'
                  )}
                  alt="channel picture"
                  draggable={false}
                />
                <div>{shortenAddress(subscriber.wallet?.address)}</div>
              </div>
            </AddressExplorerLink>
          )}
        </div>
      ))}
      {pageInfo?.next && subscribers.length !== pageInfo?.totalCount && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default SubscribersList
