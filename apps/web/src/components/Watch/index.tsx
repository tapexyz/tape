import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Analytics, TRACK } from '@lenstube/browser'
import { getPublication, isWatchable } from '@lenstube/generic'
import type { AnyPublication } from '@lenstube/lens'
import { usePublicationQuery } from '@lenstube/lens'
import { CustomCommentsFilterEnum } from '@lenstube/lens/custom-types'
import useAppStore from '@lib/store'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import AboutChannel from './AboutChannel'
import NonRelevantComments from './Comments/NonRelevantComments'
import VideoComments from './Comments/VideoComments'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'

const VideoDetails = () => {
  const {
    query: { id, t: time }
  } = useRouter()

  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)
  const selectedCommentFilter = useChannelStore(
    (state) => state.selectedCommentFilter
  )

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.WATCH })
  }, [])

  useEffect(() => {
    setVideoWatchTime(Number(time))
  }, [time, setVideoWatchTime])

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  })
  if (loading || !data) {
    return <VideoDetailShimmer />
  }

  if (error) {
    return <Custom500 />
  }

  const publication = data?.publication as AnyPublication
  const video = getPublication(publication)
  console.log('🚀 ~ file: index.tsx:56 ~ VideoDetails ~ video:', video)

  if (!isWatchable(video)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={video?.metadata.marketplace?.name ?? t`Watch`} />
      {!loading && !error && video ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <Video video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            <AboutChannel video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
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
