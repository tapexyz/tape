import type { Profile } from '@tape.xyz/lens'
import type { FC, ReactElement } from 'react'

import useProfileStore from '@lib/store/idb/profile'
import { Avatar, Flex, HoverCard, Inset, Text } from '@radix-ui/themes'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

import Badge from './Badge'
import FollowActions from './FollowActions'

type Props = {
  children?: ReactElement
  fontSize?: '1' | '2' | '3' | '4' | '5'
  pfp?: ReactElement
  profile: Profile
}

const HoverableProfile: FC<Props> = ({
  children,
  fontSize = '2',
  pfp,
  profile
}) => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const isMyProfile = activeProfile?.id === profile.id

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        {children ?? (
          <Link href={getProfile(profile)?.link}>
            <Flex align="center" gap="1">
              {pfp}
              <Text highContrast size={fontSize}>
                {getProfile(profile)?.slug}
              </Text>
              <Badge id={profile?.id} size="xs" />
            </Flex>
          </Link>
        )}
      </HoverCard.Trigger>
      <HoverCard.Content className="w-80">
        <Inset pb="current" side="top">
          <div
            className="bg-brand-500 relative h-24 w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
              )})`
            }}
          >
            <div className="absolute bottom-3 left-3 flex-none">
              <Avatar
                alt={getProfile(activeProfile)?.displayName}
                className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                radius="large"
                size="4"
                src={getProfilePicture(profile, 'AVATAR')}
              />
            </div>
            <div className="absolute bottom-3 right-3 flex-none">
              {!profile.operations.isFollowedByMe.value && !isMyProfile ? (
                <FollowActions profile={profile} />
              ) : null}
            </div>
          </div>
        </Inset>
        <div>
          <Link
            className="flex items-center space-x-1"
            href={getProfile(profile)?.link}
          >
            <span className="truncate text-xl font-bold">
              {getProfile(profile)?.displayName}
            </span>
            <Badge id={profile?.id} size="lg" />
          </Link>
          {profile.metadata?.bio && (
            <div className="line-clamp-3 py-1">{profile.metadata?.bio}</div>
          )}
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}

export default HoverableProfile
