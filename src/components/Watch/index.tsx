import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import getHlsData from '@utils/functions/getHlsData'
import { getIsHlsSupported } from '@utils/functions/getIsHlsSupported'
import { getPlaybackIdFromUrl } from '@utils/functions/getVideoUrl'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { PublicationDetailsDocument } from 'src/types/lens'
import type { LenstubePublication } from 'src/types/local'

import AboutChannel from './AboutChannel'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'
import VideoComments from './VideoComments'

const VideoDetails = () => {
  const {
    query: { id, t }
  } = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)
  const [video, setVideo] = useState<LenstubePublication>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.WATCH })
  }, [])

  const fetchHls = async (currentVideo: LenstubePublication) => {
    const playbackId = getPlaybackIdFromUrl(currentVideo)
    if (!playbackId) {
      setVideo(currentVideo)
      return setLoading(false)
    }
    try {
      const hls = await getHlsData(playbackId)
      const videoObject = { ...currentVideo }
      if (getIsHlsSupported() && hls) {
        videoObject.hls = hls
      }
      setVideo(videoObject)
    } catch (error) {
      setVideo(currentVideo)
    } finally {
      setLoading(false)
    }
  }

  const { data, error } = useQuery(PublicationDetailsDocument, {
    variables: {
      request: { publicationId: id },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      channelId: selectedChannel?.id ?? null
    },
    skip: !id,
    onCompleted: async (result) => {
      setLoading(true)
      const stopLoading =
        result?.publication?.__typename !== 'Post' &&
        result?.publication?.__typename !== 'Comment'
      if (!result.publication || stopLoading) {
        return setLoading(false)
      }
      await fetchHls(result?.publication as LenstubePublication)
    }
  })

  const canWatch =
    data?.publication &&
    (data?.publication?.__typename === 'Post' ||
      data?.publication?.__typename === 'Comment') &&
    !data.publication.hidden

  useEffect(() => {
    setVideoWatchTime(Number(t))
  }, [t, setVideoWatchTime])

  if (error) return <Custom500 />
  if (loading || !data) return <VideoDetailShimmer />
  if (!canWatch) return <Custom404 />

  return (
    <>
      <MetaTags title={video?.metadata?.name ?? 'Watch'} />
      {!loading && !error && video ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3 divide-y divide-gray-200 dark:divide-gray-900">
            <Video video={video} />
            <AboutChannel video={video} />
            <VideoComments video={video} />
          </div>
          <div className="col-span-1">
            <SuggestedVideos currentVideoId={video?.id} />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default VideoDetails
