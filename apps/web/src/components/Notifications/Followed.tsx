import HoverableProfile from '@components/Common/HoverableProfile'
import FollowOutline from '@components/Common/Icons/FollowOutline'
import { getProfile, getProfilePicture } from '@dragverse/generic'
import type { FollowNotification, Profile } from '@dragverse/lens'
import type { FC } from 'react'

type Props = {
  notification: FollowNotification
}

const Followed: FC<Props> = ({ notification: { followers } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <FollowOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {followers.slice(0, 30).map((profile: Profile) => (
            <HoverableProfile profile={profile} key={profile?.id}>
              <img
                className="h-7 w-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile, 'AVATAR')}
                draggable={false}
                alt={getProfile(profile)?.displayName}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">followed you</div>
      </div>
    </span>
  )
}

export default Followed
