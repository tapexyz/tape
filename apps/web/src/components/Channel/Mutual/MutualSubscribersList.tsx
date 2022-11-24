import IsVerified from '@components/Common/IsVerified'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import type { Profile } from 'lens'
import { useMutualFollowersQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import getProfilePicture from 'utils/functions/getProfilePicture'
type Props = {
  viewingChannelId: string
}

const MutualSubscribersList: FC<Props> = ({ viewingChannelId }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const request = {
    viewingProfileId: viewingChannelId,
    yourProfileId: selectedChannel?.id,
    limit: 30
  }

  const { data, loading, fetchMore } = useMutualFollowersQuery({
    variables: {
      request
    },
    skip: !viewingChannelId
  })

  const mutualSubscribers = data?.mutualFollowersProfiles?.items as Profile[]
  const pageInfo = data?.mutualFollowersProfiles?.pageInfo

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
  if (mutualSubscribers?.length === 0)
    return (
      <div className="pt-5">
        <NoDataFound text="No subscribers" isCenter />
      </div>
    )

  return (
    <div className="mt-4 space-y-3">
      {mutualSubscribers?.map((channel: Profile) => (
        <Link
          href={`/channel/${channel?.handle}`}
          className="flex items-center justify-between font-base"
          key={channel?.id}
        >
          <div className="flex items-center space-x-1.5">
            <img
              className="w-5 h-5 rounded"
              src={getProfilePicture(channel)}
              alt="channel"
              draggable={false}
            />
            <div className="flex items-center space-x-1">
              <span>{channel?.handle}</span>
              <IsVerified id={channel?.id} size="xs" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs whitespace-nowrap opacity-80">
            <BiUser />
            <span>{channel.stats.totalFollowers}</span>
          </div>
        </Link>
      ))}
      {pageInfo?.next && mutualSubscribers.length !== pageInfo?.totalCount && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MutualSubscribersList
