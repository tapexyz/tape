import HoverableProfile from '@components/Common/HoverableProfile'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import ChannelCirclesShimmer from '@components/Shimmers/ChannelCirclesShimmer'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { LimitType, useMutualFollowersQuery } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea,
  Text
} from '@radix-ui/themes'
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
    return <ChannelCirclesShimmer />
  }

  if (!mutualFollowers?.length) {
    return null
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex pt="3" align="center">
          <button type="button" className="flex cursor-pointer -space-x-1.5">
            {mutualFollowers.slice(0, 4)?.map((profile: Profile) => (
              <HoverableProfile profile={profile} key={profile?.id}>
                <img
                  title={profile?.handle}
                  className="h-5 w-5 rounded-full border dark:border-gray-700/80"
                  src={getProfilePicture(profile, 'AVATAR')}
                  draggable={false}
                  alt={profile?.handle}
                />
              </HoverableProfile>
            ))}
          </button>
          <Text size="2">Followed by</Text>
          {mutualFollowers
            .slice(0, 4)
            ?.map((profile: Profile) => (
              <Text key={profile?.id}>{trimLensHandle(profile?.handle)}</Text>
            ))}
          {mutualFollowers.length > FETCH_COUNT && (
            <Text size="2">and few others</Text>
          )}
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
