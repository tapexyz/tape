import { useQuery } from '@apollo/client'
import IsVerified from '@components/Common/IsVerified'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import getProfilePicture from '@utils/functions/getProfilePicture'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { BiUser } from 'react-icons/bi'
import {
  MutualFollowersDocument,
  PaginatedResultInfo,
  Profile
} from 'src/types/lens'
type Props = {
  viewingChannelId: string
}

const MutualSubscribersList: FC<Props> = ({ viewingChannelId }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const [mutualSubscribers, setMutualSubscribers] = useState<Profile[]>([])
  const { data, loading, fetchMore } = useQuery(MutualFollowersDocument, {
    variables: {
      request: {
        viewingProfileId: viewingChannelId,
        yourProfileId: selectedChannel?.id,
        limit: 10
      }
    },
    skip: !viewingChannelId,
    onCompleted(data) {
      setPageInfo(data?.mutualFollowersProfiles?.pageInfo)
      setMutualSubscribers(data?.mutualFollowersProfiles?.items as Profile[])
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            viewingProfileId: viewingChannelId,
            yourProfileId: selectedChannel?.id,
            limit: 10,
            cursor: pageInfo?.next
          }
        }
      })
      setPageInfo(data?.mutualFollowersProfiles?.pageInfo)
      setMutualSubscribers([
        ...mutualSubscribers,
        ...(data?.mutualFollowersProfiles?.items as Profile[])
      ])
    }
  })

  if (loading) return <Loader />
  if (data?.mutualFollowersProfiles?.items?.length === 0)
    return (
      <div className="pt-5">
        <NoDataFound text="No subscribers" isCenter />
      </div>
    )

  return (
    <div className="mt-4 space-y-3">
      {mutualSubscribers?.map((channel: Profile) => (
        <Link
          href={`/${channel?.handle}`}
          className="flex items-center justify-between font-base"
          key={channel?.id}
        >
          <div className="flex items-center space-x-1.5">
            <img
              className="w-5 h-5 rounded"
              src={getProfilePicture(channel)}
              alt="channel picture"
              draggable={false}
            />
            <div className="flex items-center space-x-1">
              <span>{channel?.handle}</span>
              <IsVerified id={channel?.id} size="xs" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs whitespace-nowrap opacity-80">
            <BiUser />
            <span>{channel.stats.totalFollowers}</span>
          </div>
        </Link>
      ))}
      {pageInfo?.next && mutualSubscribers.length !== pageInfo?.totalCount && (
        <span ref={observe} className="p-5">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default MutualSubscribersList
