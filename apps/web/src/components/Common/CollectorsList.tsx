import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@tape.xyz/generic'
import type { Profile, WhoActedOnPublicationRequest } from '@tape.xyz/lens'
import {
  LimitType,
  OpenActionCategoryType,
  useWhoActedOnPublicationQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import Badge from './Badge'
import UserOutline from './Icons/UserOutline'

type Props = {
  videoId: string
}

const CollectorsList: FC<Props> = ({ videoId }) => {
  const request: WhoActedOnPublicationRequest = {
    where: {
      anyOf: [{ category: OpenActionCategoryType.Collect }]
    },
    on: videoId,
    limit: LimitType.TwentyFive
  }

  const { data, loading, fetchMore } = useWhoActedOnPublicationQuery({
    variables: { request },
    skip: !videoId
  })

  const collectors = data?.whoActedOnPublication?.items as Profile[]
  const pageInfo = data?.whoActedOnPublication?.pageInfo

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
  if (collectors?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No collectors yet" isCenter />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {collectors?.map((profile: Profile) => (
        <div className="flex flex-col" key={profile.ownedBy.address}>
          <Link
            href={`/channel/${trimLensHandle(profile?.handle)}`}
            className="font-base flex items-center justify-between"
          >
            <div className="flex items-center space-x-1.5">
              <img
                className="h-5 w-5 rounded-full"
                src={getProfilePicture(profile, 'AVATAR')}
                alt={profile.handle}
                draggable={false}
              />
              <div className="flex items-center space-x-1">
                <span>{trimLensHandle(profile?.handle)}</span>
                <Badge id={profile?.id} size="xs" />
              </div>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
              <UserOutline className="h-2.5 w-2.5 opacity-60" />
              <span>{formatNumber(profile.stats.followers)}</span>
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

export default CollectorsList
