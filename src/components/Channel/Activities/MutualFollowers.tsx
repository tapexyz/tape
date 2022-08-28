import { useQuery } from '@apollo/client'
import { MUTUAL_FOLLOWERS_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import getProfilePicture from '@utils/functions/getProfilePicture'
import React, { FC, useState } from 'react'
import { Profile } from 'src/types'
type Props = {
  channel: Profile
}

const mutualFollwersShowLimit = 3

const MutualFollowers: FC<Props> = ({ channel }) => {
  const [mutualFollwers, setMutualFollwers] = useState<Profile[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  useQuery(MUTUAL_FOLLOWERS_QUERY, {
    variables: {
      request: {
        viewingProfileId: channel?.id,
        yourProfileId: selectedChannel?.id,
        limit: 10
      }
    },
    skip: !channel?.id,
    onCompleted(data) {
      setMutualFollwers(data?.mutualFollowersProfiles?.items)
      setTotalCount(data?.mutualFollowersProfiles?.pageInfo?.totalCount)
    }
  })

  return (
    <div className="flex space-x-2 mt-1 text-sm">
      <div className="contents -space-x-2">
        {mutualFollwers
          .filter((item, index) => index < mutualFollwersShowLimit)
          .map((profile: Profile) => (
            <img
              key={profile?.id}
              className="w-5 h-5 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(profile)}
              alt={profile?.handle}
            />
          ))}
      </div>
      <div>
        {mutualFollwers
          .filter((item, index) => index < mutualFollwersShowLimit)
          .map((profile: Profile, index) => (
            <span key={profile.id}>
              {profile.name ?? profile?.handle}
              {index < mutualFollwersShowLimit - 1 &&
                mutualFollwers.length > 1 &&
                ', '}
            </span>
          ))}
        {mutualFollwers.length > mutualFollwersShowLimit && (
          <span>
            {` and ${totalCount - mutualFollwersShowLimit}
             more`}
          </span>
        )}
        {mutualFollwers.length > 0 && <span> also watching this channel </span>}
      </div>
    </div>
  )
}

export default MutualFollowers
