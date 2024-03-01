import HoverableProfile from '@components/Common/HoverableProfile';
import { getProfile, getProfilePicture } from '@dragverse/generic';
import type { FollowNotification, Profile } from '@dragverse/lens';
import { FollowOutline } from '@dragverse/ui';
import type { FC } from 'react';

type Props = {
  notification: FollowNotification
}

const Followed: FC<Props> = ({ notification: { followers } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <FollowOutline className="size-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {followers.slice(0, 30).map((profile: Profile) => (
            <HoverableProfile profile={profile} key={profile?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
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
