import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import type { Profile } from 'lens'
import { useAllProfilesQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useRef } from 'react'
import getProfilePicture from 'utils/functions/getProfilePicture'

import UserOutline from './Icons/UserOutline'
import IsVerified from './IsVerified'

type Props = {
  videoId: string
}

const MirroredList: FC<Props> = ({ videoId }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const request = { whoMirroredPublicationId: videoId, limit: 30 }

  const { data, loading, fetchMore } = useAllProfilesQuery({
    variables: {
      request
    },
    skip: !videoId
  })

  const mirroredByProfiles = data?.profiles?.items as Profile[]
  const pageInfo = data?.profiles?.pageInfo

  usePaginationLoading({
    ref: sectionRef,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
  })

  if (loading) {
    return <Loader />
  }
  if (mirroredByProfiles?.length === 0) {
    return (
      <div className="pt-5">
        <NoDataFound text="No mirrors yet" isCenter />
      </div>
    )
  }

  return (
    <div ref={sectionRef} className="mt-4 space-y-3">
      {mirroredByProfiles?.map((profile: Profile) => (
        <div className="flex flex-col" key={profile.ownedBy}>
          <Link
            href={`/channel/${profile?.handle}`}
            className="font-base flex items-center justify-between"
          >
            <div className="flex items-center space-x-1.5">
              <img
                className="h-5 w-5 rounded"
                src={getProfilePicture(profile, 'avatar')}
                alt={profile.handle}
                draggable={false}
              />
              <div className="flex items-center space-x-1">
                <span>{profile?.handle}</span>
                <IsVerified id={profile?.id} size="xs" />
              </div>
            </div>
            <div className="flex items-center space-x-1 whitespace-nowrap text-xs opacity-80">
              <UserOutline className="h-2.5 w-2.5 opacity-60" />
              <span>{profile.stats.totalFollowers}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && (
        <span className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MirroredList
