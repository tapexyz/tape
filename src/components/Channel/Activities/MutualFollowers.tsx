import { useQuery } from '@apollo/client'
import Tooltip from '@components/UIElements/Tooltip'
import { MUTUAL_SUBSCRIBERS_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import getProfilePicture from '@utils/functions/getProfilePicture'
import React, { FC, useState } from 'react'
import { Profile } from 'src/types'

type Props = {
  viewingChannelId: string
}

const MutualFollowers: FC<Props> = ({ viewingChannelId }) => {
  const [mutualFollowers, setMutualFollowers] = useState<Profile[]>([])
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  useQuery(MUTUAL_SUBSCRIBERS_QUERY, {
    variables: {
      request: {
        viewingProfileId: viewingChannelId,
        yourProfileId: selectedChannel?.id,
        limit: 5
      }
    },
    skip: !viewingChannelId,
    onCompleted(data) {
      setMutualFollowers(data?.mutualFollowersProfiles?.items)
    }
  })

  return (
    <div className="flex mt-1 space-x-2 text-sm">
      <Tooltip content="Also watching this channel" placement="top">
        <div className="flex -space-x-2">
          {mutualFollowers.map((channel: Profile) => (
            <img
              key={channel?.id}
              className="border rounded-full w-7 h-7 dark:border-gray-700/80"
              src={getProfilePicture(channel)}
              draggable={false}
              alt={channel?.handle}
            />
          ))}
        </div>
      </Tooltip>
    </div>
  )
}

export default MutualFollowers
