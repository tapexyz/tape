import { useQuery } from '@apollo/client'
import useAppStore from '@lib/store'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { DOES_FOLLOW } from '@utils/gql/queries'
import Link from 'next/link'
import React from 'react'
import { Profile } from 'src/types'

import JoinChannel from '../BasicInfo/JoinChannel'
import Subscribe from '../BasicInfo/Subscribe'
import UnSubscribe from '../BasicInfo/UnSubscribe'

const OtherChannelCard = ({ channel }: { channel: Profile }) => {
  const { selectedChannel } = useAppStore()
  const { data } = useQuery(DOES_FOLLOW, {
    variables: {
      request: {
        followInfos: {
          followerAddress: selectedChannel?.ownedBy,
          profileId: channel?.id
        }
      }
    },
    skip: !selectedChannel
  })
  const isFollower = (data?.doesFollow[0].follows as boolean) ?? false
  const subscribeType = channel?.followModule?.__typename

  return (
    <div className="flex w-40 flex-col justify-center p-1.5 border border-gray-100 rounded-md dark:border-gray-900">
      <img
        className="object-cover h-32 rounded-md"
        src={imageCdn(getProfilePicture(channel))}
        alt=""
        draggable={false}
      />
      <div className="px-1 py-2 overflow-hidden">
        <Link href={`/${channel.handle}`}>
          <a className="block font-medium truncate">{channel.handle}</a>
        </Link>
        <span className="text-xs opacity-70">
          {channel.stats.totalFollowers} subscribers
        </span>
      </div>
      {subscribeType === 'FeeFollowModuleSettings' ? (
        isFollower ? (
          <UnSubscribe channel={channel} />
        ) : (
          <JoinChannel channel={channel} />
        )
      ) : isFollower ? (
        <UnSubscribe channel={channel} />
      ) : (
        <Subscribe channel={channel} />
      )}
    </div>
  )
}

export default OtherChannelCard
