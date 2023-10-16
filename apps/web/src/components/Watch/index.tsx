import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import useAppStore from '@lib/store'
import { t } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { getPublication, isWatchable } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import { usePublicationQuery } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import AboutChannel from './AboutChannel'
import VideoComments from './Comments/VideoComments'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'

const VideoDetails = () => {
  const {
    query: { id, t: time }
  } = useRouter()

  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)

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

  if (!isWatchable(video)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={video?.metadata.marketplace?.name ?? t`Watch`} />
      {!loading && !error && video ? (
        <div className="mx-auto grid max-w-[130rem] grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <Video video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            <AboutChannel video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            <VideoComments video={video} />
            {/* {selectedCommentFilter ===
            CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
              <NonRelevantComments video={video} className="pt-4" />
            ) : null} */}
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
