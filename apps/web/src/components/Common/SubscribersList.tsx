import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { Follower, Profile } from 'lens'
import { useSubscribersQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import { shortenAddress } from 'utils/functions/shortenAddress'

import IsVerified from './IsVerified'
import AddressExplorerLink from './Links/AddressExplorerLink'

type Props = {
  channel: Profile
}

const SubscribersList: FC<Props> = ({ channel }) => {
  const request = { profileId: channel?.id, limit: 30 }

  const { data, loading, fetchMore } = useSubscribersQuery({
    variables: { request },
    skip: !channel?.id
  })

  const subscribers = data?.followers?.items as Follower[]
  const pageInfo = data?.followers?.pageInfo

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
    }
  })

  if (loading) return <Loader />
  if (subscribers?.length === 0)
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
            <Link
              href={`/channel/${subscriber.wallet?.defaultProfile?.handle}`}
              className="font-base flex items-center justify-between"
            >
              <div className="flex items-center space-x-1.5">
                <img
                  className="h-5 w-5 rounded"
                  src={getProfilePicture(
                    subscriber.wallet?.defaultProfile,
                    'avatar'
                  )}
                  alt={subscriber.wallet.defaultProfile.handle}
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
              <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
                <BiUser />
                <span>
                  {formatNumber(
                    subscriber.wallet.defaultProfile.stats.totalFollowers
                  )}
                </span>
              </div>
            </Link>
          ) : (
            <AddressExplorerLink address={subscriber.wallet?.address}>
              <div className="font-base flex items-center space-x-1.5">
                <img
                  className="h-5 w-5 rounded"
                  src={imageCdn(
                    getRandomProfilePicture(subscriber.wallet.address),
                    'avatar'
                  )}
                  alt={subscriber.wallet.address.handle}
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
