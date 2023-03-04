import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import useAppStore from '@lib/store'
import type { Publication } from 'lens'
import { usePublicationDetailsQuery } from 'lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { Analytics, TRACK } from 'utils'
import isWatchable from 'utils/functions/isWatchable'

import AboutChannel from './AboutChannel'
import VideoComments from './Comments/VideoComments'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'

const VideoDetails = () => {
  const {
    query: { id, t }
  } = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)

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
    setVideoWatchTime(Number(t))
  }, [t, setVideoWatchTime])

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
      <MetaTags title={video?.metadata?.name ?? 'Watch'} />
      {!loading && !error && video ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <Video video={video} />
            <hr className="border border-gray-200 dark:border-gray-800" />
            <AboutChannel video={video} />
            <hr className="border border-gray-200 dark:border-gray-800" />
            <VideoComments video={video} />
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
