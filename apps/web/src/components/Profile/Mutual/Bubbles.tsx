import HoverableProfile from '@components/Common/HoverableProfile'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import BubblesShimmer from '@components/Shimmers/BubblesShimmer'
import useProfileStore from '@lib/store/profile'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea
} from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import MutualFollowers from './MutualFollowers'

type Props = {
  viewing: string
  showSeparator?: boolean
}

const Bubbles: FC<Props> = ({ viewing, showSeparator }) => {
  const { activeProfile } = useProfileStore()

  const { data, loading } = useMutualFollowersQuery({
    variables: {
      request: {
        observer: activeProfile?.id,
        viewing,
        limit: LimitType.Ten
      }
    },
    skip: !viewing || !activeProfile?.id
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
        <>
          {showSeparator && <span className="middot px-1" />}
          <Flex align="center" gap="1">
            <button type="button" className="flex cursor-pointer -space-x-1.5">
              {mutualFollowers.slice(0, 3)?.map((profile: Profile) => (
                <HoverableProfile profile={profile} key={profile?.id}>
                  <img
                    className="h-7 w-7 flex-none rounded-full border bg-white dark:border-gray-700/80"
                    src={getProfilePicture(profile, 'AVATAR')}
                    draggable={false}
                    alt={getProfile(profile)?.slug}
                  />
                </HoverableProfile>
              ))}
              {mutualFollowers.length > 4 && (
                <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800">
                  <span role="img" className="text-sm">
                    👀
                  </span>
                </div>
              )}
            </button>
          </Flex>
        </>
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
