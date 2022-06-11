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
    <div className="flex flex-col items-center justify-center w-40 py-3 border border-gray-200 rounded-md dark:border-gray-900">
      <Link href={`/${channel.handle}`}>
        <a>
          <img
            className="object-cover w-24 h-24 rounded-full"
            src={imageCdn(getProfilePicture(channel))}
            alt=""
            draggable={false}
          />
        </a>
      </Link>
      <div className="px-1 py-2 overflow-hidden">
        <Link href={`/${channel.handle}`}>
          <a className="block font-medium truncate">{channel.handle}</a>
        </Link>
        <div className="text-xs text-center opacity-70">
          {channel.stats.totalFollowers} subscribers
        </div>
      </div>
      {isFollower ? (
        <UnSubscribe channel={channel} />
      ) : subscribeType === 'FeeFollowModuleSettings' ? (
        <JoinChannel channel={channel} />
      ) : (
        <Subscribe channel={channel} />
      )}
    </div>
  )
}

export default OtherChannelCard
