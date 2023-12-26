import Badge from '@components/Common/Badge'
import UserOutline from '@components/Common/Icons/UserOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { MutualFollowersRequest, Profile } from '@tape.xyz/lens'
import { LimitType, useMutualFollowersQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  viewing: string
}

const MutualFollowers: FC<Props> = ({ viewing }) => {
  const { activeProfile } = useProfileStore()

  const request: MutualFollowersRequest = {
    viewing,
    observer: activeProfile?.id,
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useMutualFollowersQuery({
    variables: {
      request
    },
    skip: !viewing
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
        <NoDataFound text="No mutual followers" withImage isCenter />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {loading && <Loader />}
      {mutualFollowers?.length === 0 && (
        <div className="pt-5">
          <NoDataFound withImage isCenter />
        </div>
      )}
      {mutualFollowers?.map((profile: Profile) => (
        <Link
          href={`/u/${getProfile(profile)?.slug}`}
          className="font-base flex items-center justify-between"
          key={profile?.id}
        >
          <div className="flex items-center space-x-1.5">
            <img
              className="size-5 rounded-full"
              src={getProfilePicture(profile, 'AVATAR')}
              alt={getProfile(profile)?.slug}
              draggable={false}
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
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MutualFollowers
