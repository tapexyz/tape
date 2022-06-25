import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import VideoDetailShimmer from '@components/Shimmers/VideoDetailShimmer'
import usePersistStore from '@lib/store/persist'
import * as Sentry from '@sentry/nextjs'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { getPlaybackIdFromUrl } from '@utils/functions/getVideoUrl'
import { VIDEO_DETAIL_QUERY } from '@utils/gql/queries'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { LenstubePublication } from 'src/types/local'

const SuggestedVideos = dynamic(() => import('./SuggestedVideos'))
const VideoComments = dynamic(() => import('./VideoComments'))
const AboutChannel = dynamic(() => import('./AboutChannel'))

const Video = dynamic(() => import('./Video'), {
  loading: () => <VideoCardShimmer />
})

const VideoDetails = () => {
  const {
    query: { id }
  } = useRouter()
  const { addToRecentlyWatched, selectedChannel } = usePersistStore()
  const [video, setVideo] = useState<LenstubePublication>()
  const [loading, setLoading] = useState(true)

  const { data, error } = useQuery(VIDEO_DETAIL_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      sources: [LENSTUBE_APP_ID]
    },
    skip: !id,
    onCompleted(data) {
      let currentVideo = data?.publication as LenstubePublication
      addToRecentlyWatched(currentVideo)
      const playbackId = getPlaybackIdFromUrl(currentVideo)
      if (playbackId) {
        axios
          .get(`https://livepeer.studio/api/playback/${playbackId}`)
          .then(({ data }) => {
            let videoObject = { ...currentVideo }
            videoObject.hls = data.meta.source[0]
            setVideo(videoObject)
          })
          .catch((e) => {
            setVideo(currentVideo)
            Sentry.captureException(e)
          })
          .finally(() => setLoading(false))
      } else {
        setVideo(currentVideo)
        setLoading(false)
      }
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <VideoDetailShimmer />
  if (!data?.publication && video?.__typename !== 'Post') return <Custom404 />

  return (
    <>
      <MetaTags title={video?.metadata?.name ?? 'Watch'} />
      {!loading && !error && video ? (
        <>
          <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
            <div className="col-span-3 space-y-3 divide-y divide-gray-200 dark:divide-gray-900">
              <Video video={video} />
              <AboutChannel video={video} />
              <VideoComments video={video} />
            </div>
            <div className="col-span-1">
              <SuggestedVideos />
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}

export default VideoDetails
