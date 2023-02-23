import Timeline from '@components/Home/Timeline'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import usePersistStore from '@lib/store/persist'
import type { Profile, Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from 'lens'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { ALLOWED_APP_IDS, LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID } from 'utils'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'

import PinnedVideo from './PinnedVideo'

type Props = {
  channel: Profile
}

const ChannelVideos: FC<Props> = ({ channel }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
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
    sources: [LENSTUBE_APP_ID, ...ALLOWED_APP_IDS]
  }

  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: {
      request
    },
    skip: !channel?.id
  })

  const channelVideos = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { pageLoading } = usePaginationLoading({
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
        <div ref={sectionRef} className="w-full">
          <Timeline videos={channelVideos} />
          {pageInfo?.next && pageLoading && (
            <span className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default ChannelVideos
