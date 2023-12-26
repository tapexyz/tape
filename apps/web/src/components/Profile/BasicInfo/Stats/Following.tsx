import type { FollowingRequest, Profile, ProfileStats } from '@tape.xyz/lens'
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
import { LimitType, useFollowingQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profileId: string
  stats: ProfileStats
}

const Following: FC<Props> = ({ profileId, stats }) => {
  const request: FollowingRequest = {
    for: profileId,
    limit: LimitType.Fifty
  }

  const { data, fetchMore, loading } = useFollowingQuery({
    skip: !profileId,
    variables: { request }
  })

  const followings = data?.following?.items as Profile[]
  const pageInfo = data?.following?.pageInfo

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
          <Text weight="bold">{formatNumber(stats.following)}</Text>
          <Text>Followings</Text>
        </Flex>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title size="6">
            {formatNumber(stats.following)} followings
          </Dialog.Title>
          <DialogClose>
            <IconButton color="gray" variant="ghost">
              <TimesOutline className="size-3" outlined={false} />
            </IconButton>
          </DialogClose>
        </Flex>
        <ScrollArea scrollbars="vertical" style={{ height: 400 }} type="hover">
          {loading && <Loader />}
          {followings?.length === 0 && (
            <div className="pt-5">
              <NoDataFound isCenter withImage />
            </div>
          )}
          <div className="space-y-2">
            {followings?.map((profile) => (
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

export default Following
