import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import {
  LimitType,
  type Profile,
  type ProfilesRequest,
  useProfilesQuery
} from '@tape.xyz/lens'
import { Spinner, UserOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import Badge from './Badge'
import HoverableProfile from './HoverableProfile'

type Props = {
  videoId: string
}

const MirroredList: FC<Props> = ({ videoId }) => {
  const request: ProfilesRequest = {
    where: {
      whoMirroredPublication: videoId
    },
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useProfilesQuery({
    variables: {
      request
    },
    skip: !videoId
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
    return <Spinner />
  }
  if (mirroredByProfiles?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No mirrors yet" isCenter />
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-3">
      {mirroredByProfiles?.map((profile: Profile) => (
        <div className="flex flex-col" key={getProfile(profile)?.slug}>
          <Link
            href={`/u/${getProfile(profile)?.slug}`}
            className="font-base flex items-center justify-between"
          >
            <HoverableProfile profile={profile} key={profile?.id}>
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
            </HoverableProfile>
            <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
              <UserOutline className="size-2.5 opacity-60" />
              <span>{profile.stats.followers}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="p-5">
          <Spinner />
        </span>
      )}
    </div>
  )
}

export default MirroredList
