import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import BubblesShimmer from '@components/Shimmers/BubblesShimmer'
import useProfileStore from '@lib/store/idb/profile'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea
} from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import React from 'react'

import MutualFollowers from './MutualFollowers'

type Props = {
  showSeparator?: boolean
  viewing: string
}

const Bubbles: FC<Props> = ({ showSeparator, viewing }) => {
  const { activeProfile } = useProfileStore()

  const { data, loading } = useMutualFollowersQuery({
    skip: !viewing || !activeProfile?.id,
    variables: {
      request: {
        limit: LimitType.Ten,
        observer: activeProfile?.id,
        viewing
      }
    }
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
        <span className="flex items-center">
          {showSeparator && <span className="middot px-1" />}
          <Flex align="center" gap="1">
            <button className="flex cursor-pointer -space-x-1.5" type="button">
              {mutualFollowers.slice(0, 3)?.map((profile: Profile) => (
                <HoverableProfile key={profile?.id} profile={profile}>
                  <img
                    alt={getProfile(profile)?.slug}
                    className="size-7 flex-none rounded-full border bg-white dark:border-gray-700/80"
                    draggable={false}
                    src={getProfilePicture(profile, 'AVATAR')}
                  />
                </HoverableProfile>
              ))}
              {mutualFollowers.length > 4 && (
                <div className="flex size-7 flex-none items-center justify-center rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800">
                  <span className="text-sm" role="img">
                    👀
                  </span>
                </div>
              )}
            </button>
          </Flex>
        </span>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title size="6">People you may know</Dialog.Title>
          <DialogClose>
            <IconButton color="gray" variant="ghost">
              <TimesOutline className="size-3" outlined={false} />
            </IconButton>
          </DialogClose>
        </Flex>
        <ScrollArea scrollbars="vertical" style={{ height: 400 }} type="hover">
          <MutualFollowers viewing={viewing} />
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Bubbles
