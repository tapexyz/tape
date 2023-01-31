import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { Profile } from 'lens'
import { useAllProfilesQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import getProfilePicture from 'utils/functions/getProfilePicture'

import IsVerified from './IsVerified'

type Props = {
  videoId: string
}

const MirroredList: FC<Props> = ({ videoId }) => {
  const request = { whoMirroredPublicationId: videoId, limit: 30 }

  const { data, loading, fetchMore } = useAllProfilesQuery({
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

  if (loading) return <Loader />
  if (mirroredByProfiles?.length === 0)
    return (
      <div className="pt-5">
        <NoDataFound text="No mirrors yet" isCenter />
      </div>
    )

  return (
    <div className="mt-4 space-y-3">
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
              <BiUser />
              <span>{profile.stats.totalFollowers}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && mirroredByProfiles.length !== pageInfo?.totalCount && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MirroredList
