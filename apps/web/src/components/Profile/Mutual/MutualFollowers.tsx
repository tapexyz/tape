import type { MutualFollowersRequest, Profile } from '@tape.xyz/lens'
import type { FC } from 'react'

import Badge from '@components/Common/Badge'
import UserOutline from '@components/Common/Icons/UserOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  viewing: string
}

const MutualFollowers: FC<Props> = ({ viewing }) => {
  const { activeProfile } = useProfileStore()

  const request: MutualFollowersRequest = {
    limit: LimitType.Fifty,
    observer: activeProfile?.id,
    viewing
  }

  const { data, fetchMore, loading } = useMutualFollowersQuery({
    skip: !viewing,
    variables: {
      request
    }
  })

  const mutualFollowers = data?.mutualFollowers?.items as Profile[]
  const pageInfo = data?.mutualFollowers?.pageInfo

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
  if (mutualFollowers?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound isCenter text="No mutual followers" withImage />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {loading && <Loader />}
      {mutualFollowers?.length === 0 && (
        <div className="pt-5">
          <NoDataFound isCenter withImage />
        </div>
      )}
      {mutualFollowers?.map((profile: Profile) => (
        <Link
          className="font-base flex items-center justify-between"
          href={`/u/${getProfile(profile)?.slug}`}
          key={profile?.id}
        >
          <div className="flex items-center space-x-1.5">
            <img
              alt={getProfile(profile)?.slug}
              className="size-5 rounded-full"
              draggable={false}
              src={getProfilePicture(profile, 'AVATAR')}
            />
            <div className="flex items-center space-x-1">
              <span>{getProfile(profile)?.slug}</span>
              <Badge id={profile?.id} size="xs" />
            </div>
          </div>
          <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
            <UserOutline className="size-2.5 opacity-60" />
            <span>{formatNumber(profile.stats.followers)}</span>
          </div>
        </Link>
      ))}
      {pageInfo?.next && (
        <span className="p-5" ref={observe}>
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MutualFollowers
