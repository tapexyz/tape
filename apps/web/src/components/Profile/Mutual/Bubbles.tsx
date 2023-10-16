import HoverableProfile from '@components/Common/HoverableProfile'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import BubblesShimmer from '@components/Shimmers/BubblesShimmer'
import useAuthPersistStore from '@lib/store/auth'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea,
  Text
} from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import MutualFollowers from './MutualFollowers'

type Props = {
  viewing: string
}

const FETCH_COUNT = 5

const Bubbles: FC<Props> = ({ viewing }) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const { data, loading } = useMutualFollowersQuery({
    variables: {
      request: {
        observer: selectedSimpleProfile?.id,
        viewing,
        limit: LimitType.Ten
      }
    },
    skip: !viewing || !selectedSimpleProfile?.id
  })

  const mutualFollowers = data?.mutualFollowers?.items as Profile[]

  if (loading) {
    return <BubblesShimmer />
  }

  if (!mutualFollowers?.length) {
    return null
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex mt="3" align="center" gap="1">
          <button type="button" className="flex cursor-pointer -space-x-1.5">
            {mutualFollowers.slice(0, 3)?.map((profile: Profile) => (
              <HoverableProfile profile={profile} key={profile?.id}>
                <img
                  className="h-5 w-5 rounded-full border dark:border-gray-700/80"
                  src={getProfilePicture(profile, 'AVATAR')}
                  draggable={false}
                  alt={getProfile(profile)?.slug}
                />
              </HoverableProfile>
            ))}
          </button>
          <div className="flex items-center space-x-1.5">
            <Text size="2">Followed by</Text>
            {mutualFollowers.slice(0, 3)?.map((profile: Profile, i) => (
              <Text key={profile?.id}>
                {getProfile(profile)?.slug}
                {mutualFollowers.length === i + 1 ? '' : ','}
              </Text>
            ))}
            {mutualFollowers.length > FETCH_COUNT && (
              <Text size="2">and few others</Text>
            )}
          </div>
        </Flex>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title size="6">People you may know</Dialog.Title>
          <DialogClose>
            <IconButton variant="ghost" color="gray">
              <TimesOutline outlined={false} className="h-4 w-4" />
            </IconButton>
          </DialogClose>
        </Flex>
        <ScrollArea type="hover" scrollbars="vertical" style={{ height: 400 }}>
          <MutualFollowers viewing={viewing} />
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Bubbles
