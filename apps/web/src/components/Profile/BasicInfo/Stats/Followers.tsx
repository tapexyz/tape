import type { FollowersRequest, Profile, ProfileStats } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea,
  Text
} from '@radix-ui/themes'
import { formatNumber } from '@tape.xyz/generic'
import { LimitType, useFollowersQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profileId: string
  stats: ProfileStats
}

const Followers: FC<Props> = ({ profileId, stats }) => {
  const request: FollowersRequest = {
    limit: LimitType.Fifty,
    of: profileId
  }

  const { data, fetchMore, loading } = useFollowersQuery({
    skip: !profileId,
    variables: { request }
  })

  const followers = data?.followers?.items as Profile[]
  const pageInfo = data?.followers?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex align="end" gap="1">
          <Text weight="bold">{formatNumber(stats.followers)}</Text>
          <Text>Followers</Text>
        </Flex>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title size="6">
            {formatNumber(stats.followers)} followers
          </Dialog.Title>
          <DialogClose>
            <IconButton color="gray" variant="ghost">
              <TimesOutline className="size-3" outlined={false} />
            </IconButton>
          </DialogClose>
        </Flex>
        <ScrollArea scrollbars="vertical" style={{ height: 400 }} type="hover">
          {loading && <Loader />}
          {followers?.length === 0 && (
            <div className="pt-5">
              <NoDataFound isCenter withImage />
            </div>
          )}
          <div className="space-y-2">
            {followers?.map((profile) => (
              <div key={profile.id}>
                <span className="inline-flex">
                  <HoverableProfile fontSize="3" profile={profile} />
                </span>
              </div>
            ))}
          </div>
          {pageInfo?.next && (
            <span className="p-5" ref={observe}>
              <Loader />
            </span>
          )}
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Followers
