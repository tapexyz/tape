import MetaTags from '@components/Common/MetaTags'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import usePersistStore from '@lib/store/persist'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { LenstubePublication } from 'src/types/local'

const SuggestedVideos = dynamic(() => import('./SuggestedVideos'))
const VideoComments = dynamic(() => import('./VideoComments'))
const AboutChannel = dynamic(() => import('./AboutChannel'))

const Video = dynamic(() => import('./Video'), {
  loading: () => <VideoCardShimmer />
})

const VideoDetails = ({ video }: { video: LenstubePublication }) => {
  const { addToRecentlyWatched } = usePersistStore()

  // const playbackId = getPlaybackIdFromUrl(currentVideo)
  // if (playbackId) {
  //   axios
  //     .get(`https://livepeer.studio/api/playback/${playbackId}`)
  //     .then(({ data }) => {
  //       let videoObject = { ...currentVideo }
  //       videoObject.hls = data.meta.source[0]
  //       setVideo(videoObject)
  //     })
  //     .catch(() => {
  //       setVideo(currentVideo)
  //     })
  //     .finally(() => setLoading(false))
  // } else {
  //   setVideo(currentVideo)
  //   setLoading(false)
  // }
  // setVideo(currentVideo)
  // setLoading(false)

  useEffect(() => {
    if (video) addToRecentlyWatched(video)
  }, [video, addToRecentlyWatched])

  return (
    <>
      <MetaTags
        title={video?.metadata?.name ?? 'Watch'}
        image={imageCdn(getThumbnailUrl(video))}
        description={
          video.metadata?.description ||
          `Published by @${video.profile.handle} via Lenstube.`
        }
        isLarge
      />
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
  )
}

export default VideoDetails
