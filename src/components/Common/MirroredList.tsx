import { useQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import getProfilePicture from '@utils/functions/getProfilePicture'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import {
  AllProfilesDocument,
  PaginatedResultInfo,
  Profile
} from 'src/types/lens'

import IsVerified from './IsVerified'

type Props = {
  videoId: string
}

const MirroredList: FC<Props> = ({ videoId }) => {
  const [mirroredList, setMirroredList] = useState<Profile[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, fetchMore } = useQuery(AllProfilesDocument, {
    variables: {
      request: { whoMirroredPublicationId: videoId, limit: 10 }
    },
    skip: !videoId,
    onCompleted: (data) => {
      setPageInfo(data?.profiles?.pageInfo)
      setMirroredList(data?.profiles?.items as Profile[])
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              whoMirroredPublicationId: videoId,
              cursor: pageInfo?.next,
              limit: 10
            }
          }
        })
        setPageInfo(data?.profiles?.pageInfo)
        setMirroredList([
          ...mirroredList,
          ...(data?.profiles?.items as Profile[])
        ])
      } catch {}
    }
  })

  if (loading) return <Loader />
  if (data?.profiles?.items?.length === 0)
    return (
      <div className="pt-5">
        <NoDataFound text="No mirrors yet" isCenter />
      </div>
    )

  return (
    <div className="mt-4 space-y-3">
      {mirroredList?.map((profile: Profile) => (
        <div className="flex flex-col" key={profile.ownedBy}>
          <Link
            href={`/${profile?.handle}`}
            className="flex items-center justify-between font-base"
          >
            <div className="flex items-center space-x-1.5">
              <img
                className="w-5 h-5 rounded"
                src={getProfilePicture(profile, 'avatar')}
                alt="channel picture"
                draggable={false}
              />
              <div className="flex items-center space-x-1">
                <span>{profile?.handle}</span>
                <IsVerified id={profile?.id} size="xs" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs whitespace-nowrap opacity-80">
              <BiUser />
              <span>{profile.stats.totalFollowers}</span>
            </div>
          </Link>
        </div>
      ))}
      {pageInfo?.next && mirroredList.length !== pageInfo?.totalCount && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MirroredList
