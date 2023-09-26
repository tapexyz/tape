import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { FollowersRequest, Profile } from '@lenstube/lens'
import { LimitType, useFollowersQuery } from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import { t } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import Badge from './Badge'
import UserOutline from './Icons/UserOutline'

type Props = {
  profileId: string
}

const SubscribersList: FC<Props> = ({ profileId }) => {
  const request: FollowersRequest = {
    of: profileId,
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profileId
  })

  const subscribers = data?.followers?.items as Profile[]
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

  if (loading) {
    return <Loader />
  }
  if (subscribers?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text={t`No subscribers`} isCenter />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {subscribers?.map((subscriber) => (
        <div className="flex flex-col" key={subscriber.ownedBy.address}>
          <Link
            href={`/channel/${trimLensHandle(subscriber?.handle)}`}
            className="font-base flex items-center justify-between"
          >
            <div className="flex items-center space-x-1.5">
              <img
                className="h-5 w-5 rounded-full"
                src={getProfilePicture(subscriber, 'AVATAR')}
                alt={subscriber.handle}
                draggable={false}
              />
              <div className="flex items-center space-x-1">
                <span>{trimLensHandle(subscriber?.handle)}</span>
                <Badge id={subscriber?.id} size="xs" />
              </div>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
              <UserOutline className="h-2.5 w-2.5 opacity-60" />
              <span>{formatNumber(subscriber.stats.followers)}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default SubscribersList
