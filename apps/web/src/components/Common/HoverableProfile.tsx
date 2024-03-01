import Stats from '@components/Profile/BasicInfo/Stats'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@dragverse/generic'
import type { Profile } from '@dragverse/lens'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@dragverse/ui'
import useProfileStore from '@lib/store/idb/profile'
import Link from 'next/link'
import type { FC, ReactElement } from 'react'

import Badge from './Badge'
import FollowActions from './FollowActions'

type Props = {
  profile: Profile
  children?: ReactElement
  pfp?: ReactElement
}

const HoverableProfile: FC<Props> = ({ profile, children, pfp }) => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const isMyProfile = activeProfile?.id === profile.id

  return (
    <HoverCard>
      <HoverCardTrigger>
        {children ?? (
          <Link href={getProfile(profile)?.link}>
            <div className="flex items-center gap-1">
              {pfp}
              <span>{getProfile(profile)?.slug}</span>
              <Badge id={profile?.id} size="xs" />
            </div>
          </Link>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="tape-border dark:bg-brand-850 z-10 w-80 overflow-hidden rounded-xl bg-white shadow">
        <div className="inset-0">
          <div
            style={{
              backgroundImage: `url(${imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
              )})`
            }}
            className="bg-brand-500 relative h-24 w-full bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute bottom-3 left-3 flex-none">
              <img
                className="size-10 rounded-lg border-2 border-white bg-white object-cover dark:bg-gray-900"
                src={getProfilePicture(profile, 'AVATAR')}
                alt={getProfile(activeProfile)?.displayName}
                draggable={false}
              />
            </div>
            <div className="absolute bottom-3 right-3 flex-none">
              {!profile.operations.isFollowedByMe.value && !isMyProfile ? (
                <FollowActions profile={profile} />
              ) : null}
            </div>
          </div>
        </div>
        <div className="p-4 text-base">
          <Link
            href={getProfile(profile)?.link}
            className="flex items-center space-x-1"
          >
            <span className="truncate text-xl font-bold">
              {getProfile(profile)?.displayName}
            </span>
            <Badge id={profile?.id} size="lg" />
          </Link>
          {profile.metadata?.bio && (
            <div className="line-clamp-2 py-1">{profile.metadata?.bio}</div>
          )}
          <div className="mt-1">
            <Stats profile={profile} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverableProfile
