import type { FC } from 'react'

import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import {
  LimitType,
  type Profile,
  type ProfilesRequest,
  useProfilesQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'

import Badge from './Badge'
import UserOutline from './Icons/UserOutline'

type Props = {
  videoId: string
}

const MirroredList: FC<Props> = ({ videoId }) => {
  const request: ProfilesRequest = {
    limit: LimitType.Fifty,
    where: {
      whoMirroredPublication: videoId
    }
  }

  const { data, fetchMore, loading } = useProfilesQuery({
    skip: !videoId,
    variables: {
      request
    }
  })

  const mirroredByProfiles = data?.profiles?.items as Profile[]
  const pageInfo = data?.profiles?.pageInfo

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
  if (mirroredByProfiles?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound isCenter text="No mirrors yet" />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {mirroredByProfiles?.map((profile: Profile) => (
        <div className="flex flex-col" key={getProfile(profile)?.slug}>
          <Link
            className="font-base flex items-center justify-between"
            href={`/u/${getProfile(profile)?.slug}`}
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
              <span>{profile.stats.followers}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && (
        <span className="p-5" ref={observe}>
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MirroredList
