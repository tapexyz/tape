import Badge from '@components/Common/Badge'
import UserOutline from '@components/Common/Icons/UserOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAuthPersistStore from '@lib/store/auth'
import { getProfilePicture, trimLensHandle } from '@tape.xyz/generic'
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
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const request: MutualFollowersRequest = {
    viewing,
    observer: selectedSimpleProfile?.id,
    limit: LimitType.TwentyFive
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
        <NoDataFound text="No subscribers" isCenter />
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
      {mutualFollowers?.map((channel: Profile) => (
        <Link
          href={`/channel/${trimLensHandle(channel?.handle)}`}
          className="font-base flex items-center justify-between"
          key={channel?.id}
        >
          <div className="flex items-center space-x-1.5">
            <img
              className="h-5 w-5 rounded-full"
              src={getProfilePicture(channel)}
              alt={channel.handle}
              draggable={false}
            />
            <div className="flex items-center space-x-1">
              <span>{trimLensHandle(channel?.handle)}</span>
              <Badge id={channel?.id} size="xs" />
            </div>
          </div>
          <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
            <UserOutline className="h-2.5 w-2.5 opacity-60" />
            <span>{channel.stats.followers}</span>
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
