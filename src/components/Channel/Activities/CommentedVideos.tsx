import { useQuery } from '@apollo/client'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  PaginatedResultInfo,
  Profile,
  ProfileCommentsDocument,
  PublicationTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

type Props = {
  channel: Profile
}

const CommentedVideos: FC<Props> = ({ channel }) => {
  const [channelVideos, setChannelVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const request = {
    publicationTypes: [PublicationTypes.Comment],
    limit: 30,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: channel?.id
  }
  const { data, loading, error, fetchMore } = useQuery(
    ProfileCommentsDocument,
    {
      variables: {
        request
      },
      skip: !channel?.id,
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        setChannelVideos(data?.publications?.items as LenstubePublication[])
      }
    }
  )
  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              cursor: pageInfo?.next
            }
          }
        })
        setPageInfo(data?.publications?.pageInfo)
        setChannelVideos([
          ...channelVideos,
          ...(data?.publications?.items as LenstubePublication[])
        ])
      } catch {}
    }
  })

  if (loading) return <TimelineShimmer />

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text="No comments on videos" />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div>
          <Timeline videos={channelVideos} videoType="Comment" />
          {pageInfo?.next && channelVideos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentedVideos
