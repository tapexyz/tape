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
import type { FollowersRequest, Profile, ProfileStats } from '@tape.xyz/lens'
import { LimitType, useFollowersQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  stats: ProfileStats
  profileId: string
}

const Followers: FC<Props> = ({ stats, profileId }) => {
  const request: FollowersRequest = {
    of: profileId,
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profileId
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
        <Flex gap="1" align="end">
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
            <IconButton variant="ghost" color="gray">
              <TimesOutline outlined={false} className="size-3" />
            </IconButton>
          </DialogClose>
        </Flex>
        <ScrollArea type="hover" scrollbars="vertical" style={{ height: 400 }}>
          {loading && <Loader />}
          {followers?.length === 0 && (
            <div className="pt-5">
              <NoDataFound withImage isCenter />
            </div>
          )}
          <div className="space-y-2">
            {followers?.map((profile) => (
              <div key={profile.id}>
                <span className="inline-flex">
                  <HoverableProfile profile={profile} fontSize="3" />
                </span>
              </div>
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="p-5">
              <Loader />
            </span>
          )}
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Followers
