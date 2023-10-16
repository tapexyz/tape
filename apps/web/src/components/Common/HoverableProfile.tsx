import { useProfileStore } from '@lib/store/profile'
import { Avatar, Flex, HoverCard, Link, Text } from '@radix-ui/themes'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import type { FC, ReactElement } from 'react'
import React from 'react'

import Badge from './Badge'
import FollowActions from './FollowActions'
import InterweaveContent from './InterweaveContent'

type Props = {
  profile: Profile
  fontSize?: '1' | '2' | '3'
  children?: ReactElement
}

const HoverableProfile: FC<Props> = ({ profile, fontSize = '2', children }) => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const isMyProfile = activeProfile?.id === profile.id

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        {children ?? (
          <Link href={`/u/${getProfile(profile)?.slug}`}>
            <Flex align="center" gap="1">
              <Text size={fontSize} color="gray">
                {getProfile(profile)?.slug}
              </Text>
              <Badge id={profile?.id} size="xs" />
            </Flex>
          </Link>
        )}
      </HoverCard.Trigger>
      <HoverCard.Content className="w-80 !p-0">
        <div
          style={{
            backgroundImage: `url(${imageCdn(
              sanitizeDStorageUrl(getProfileCoverPicture(profile))
            )})`
          }}
          className="bg-brand-500 relative h-20 w-full bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute bottom-2 left-2 flex-none">
            <Avatar
              className="border-2 border-white bg-white object-cover dark:bg-gray-900"
              size="3"
              fallback={getProfile(profile)?.displayName.charAt(0) ?? ''}
              radius="medium"
              src={getProfilePicture(profile, 'AVATAR')}
            />
          </div>
          <div className="absolute bottom-2 right-2 flex-none">
            {!profile.operations.isFollowedByMe.value && !isMyProfile ? (
              <FollowActions profile={profile} />
            ) : null}
          </div>
        </div>
        <div className="p-2 pl-4 pt-2.5">
          <Link
            href={`/u/${getProfile(profile)?.slug}`}
            className="flex items-center space-x-1"
          >
            <span className="text-2xl font-semibold leading-tight">
              {getProfile(profile)?.slug}
            </span>
            <Badge id={profile?.id} size="lg" />
          </Link>
          {profile.metadata?.bio && (
            <div className="line-clamp-4 py-2">
              <InterweaveContent content={profile.metadata?.bio} />
            </div>
          )}
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}

export default HoverableProfile
