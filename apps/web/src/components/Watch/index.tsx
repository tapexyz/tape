import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Analytics, TRACK } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import { CustomCommentsFilterEnum } from '@lenstube/lens/custom-types'
import useAppStore from '@lib/store'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import isWatchable from 'utils/functions/isWatchable'

import AboutChannel from './AboutChannel'
import NonRelevantComments from './Comments/NonRelevantComments'
import VideoComments from './Comments/VideoComments'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'

const VideoDetails = () => {
  const {
    query: { id, t: time }
  } = useRouter()
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)
  const selectedCommentFilter = useChannelStore(
    (state) => state.selectedCommentFilter
  )

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.WATCH })
  }, [])

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: id },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      channelId: selectedChannel?.id ?? null
    },
    skip: !id
  })

  const publication = data?.publication as Publication
  const video =
    publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

  useEffect(() => {
    setVideoWatchTime(Number(time))
  }, [time, setVideoWatchTime])

  if (error) {
    return <Custom500 />
  }
  if (loading || !data) {
    return <VideoDetailShimmer />
  }
  if (!isWatchable(video)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={video?.metadata?.name ?? t`Watch`} />
      {!loading && !error && video ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <Video video={video} />
            <hr className="border border-gray-200 dark:border-gray-800" />
            <AboutChannel video={video} />
            <hr className="border border-gray-200 dark:border-gray-800" />
            <VideoComments video={video} />
            {selectedCommentFilter ===
            CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
              <NonRelevantComments video={video} className="pt-4" />
            ) : null}
          </div>
          <div className="col-span-1">
            <SuggestedVideos />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default VideoDetails
