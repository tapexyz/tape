import Timeline from '@components/Home/Timeline'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import usePersistStore from '@lib/store/persist'
import type { Profile, Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from 'lens'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID, SCROLL_ROOT_MARGIN } from 'utils'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'

import PinnedVideo from './PinnedVideo'

type Props = {
  channel: Profile
}

const ChannelVideos: FC<Props> = ({ channel }) => {
  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const pinnedVideoId = getValueFromKeyInAttributes(
    channel?.attributes,
    'pinnedPublicationId'
  )

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 32,
    metadata: { mainContentFocus: [PublicationMainFocus.Video] },
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: channel?.id,
    sources: [LENSTUBE_APP_ID]
  }

  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: {
      request
    },
    skip: !channel?.id
  })

  const channelVideos = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
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
    return (
      <>
        <PinnedVideoShimmer />
        <TimelineShimmer />
      </>
    )
  }

  if (data?.publications?.items?.length === 0 && queuedVideos.length === 0) {
    return <NoDataFound isCenter withImage text="No videos found" />
  }

  return (
    <>
      {pinnedVideoId?.length && (
        <span className="hidden lg:block">
          <PinnedVideo id={pinnedVideoId} />
        </span>
      )}
      {!error && !loading && (
        <>
          <Timeline videos={channelVideos} />
          {pageInfo?.next && channelVideos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default ChannelVideos
