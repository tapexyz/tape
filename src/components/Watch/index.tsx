import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import {
  SuggestedVideosShimmer,
  VideoDetailShimmer
} from '@components/Shimmers/VideoDetailShimmer'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { getPlaybackIdFromUrl } from '@utils/functions/getVideoUrl'
import { VIDEO_DETAIL_QUERY } from '@utils/gql/queries'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { LenstubePublication } from 'src/types/local'

const SuggestedVideos = dynamic(() => import('./SuggestedVideos'), {
  loading: () => <SuggestedVideosShimmer />
})
const VideoComments = dynamic(() => import('./VideoComments'))
const AboutChannel = dynamic(() => import('./AboutChannel'))

const Video = dynamic(() => import('./Video'), {
  loading: () => <CardShimmer />
})

const VideoDetails = () => {
  const {
    query: { id, t }
  } = useRouter()
  const addToRecentlyWatched = usePersistStore(
    (state) => state.addToRecentlyWatched
  )
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const [video, setVideo] = useState<LenstubePublication>()
  const [loading, setLoading] = useState(true)

  const getHlsUrl = async (currentVideo: LenstubePublication) => {
    const playbackId = getPlaybackIdFromUrl(currentVideo)
    if (!playbackId) {
      setVideo(currentVideo)
      return setLoading(false)
    }
    try {
      const { data } = await axios.get(
        `https://livepeer.studio/api/playback/${playbackId}`
      )
      let videoObject = { ...currentVideo }
      videoObject.hls = data.meta?.source[0]
      setVideo(videoObject)
    } catch (error) {
      setVideo(currentVideo)
    } finally {
      setLoading(false)
    }
  }

  const { data, error } = useQuery(VIDEO_DETAIL_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      sources: [LENSTUBE_APP_ID]
    },
    skip: !id,
    fetchPolicy: 'no-cache',
    onCompleted: async (result) => {
      setLoading(true)
      await getHlsUrl(result?.publication)
    }
  })

  useEffect(() => {
    if (video) addToRecentlyWatched(video)
  }, [video, addToRecentlyWatched])

  if (error) return <Custom500 />
  if (loading || !data) return <VideoDetailShimmer />
  if (!data?.publication && video?.__typename !== 'Post') return <Custom404 />

  return (
    <>
      <MetaTags title={video?.metadata?.name ?? 'Watch'} />
      {!loading && !error && video ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3 divide-y divide-gray-200 dark:divide-gray-900">
            <Video video={video} time={Number(t)} />
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
