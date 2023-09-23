import FollowOutline from '@components/Common/Icons/FollowOutline'
import ProfilePreview from '@components/Common/UserPreview'
import { getProfilePicture } from '@lenstube/generic'
import type { FollowNotification, Profile } from '@lenstube/lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: FollowNotification
}

const Followed: FC<Props> = ({ notification: { followers } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1.5">
        <FollowOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          {followers?.map((profile: Profile) => (
            <ProfilePreview profile={profile} key={profile?.id}>
              <img
                title={profile?.handle}
                className="h-7 w-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile)}
                draggable={false}
                alt={profile?.handle}
              />
            </ProfilePreview>
          ))}
        </span>
        <div className="py-2">followed you</div>
      </div>
    </span>
  )
}

export default Followed
