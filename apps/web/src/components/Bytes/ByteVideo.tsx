import CollectVideo from '@components/Watch/CollectVideo'
import { ControlsContainer } from '@livepeer/react'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import type { LenstubePublication } from 'utils'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import VideoPlayer from 'web-ui/VideoPlayer'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: LenstubePublication
}

const ByteVideo: FC<Props> = ({ video }) => {
  const [videoRef, setVideoRef] = useState<HTMLMediaElement>()
  const [playing, setIsPlaying] = useState(true)

  const playVideo = () => {
    if (!videoRef) return
    videoRef.currentTime = 0
    videoRef.volume = 1
    videoRef
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {})
  }

  const onClickVideo = () => {
    if (videoRef?.paused) {
      playVideo()
    } else {
      videoRef?.pause()
      setIsPlaying(false)
    }
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    if (ref?.paused) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
    setVideoRef(ref)
  }

  const { observe } = useInView({
    threshold: 1,
    onLeave: () => {
      videoRef?.pause()
      setIsPlaying(false)
    },
    onEnter: () => {
      const nextUrl = window.location.origin + `/bytes/${video?.id}`
      window.history.replaceState({ path: nextUrl }, '', nextUrl)
      playVideo()
    }
  })

  return (
    <div ref={observe} className="flex justify-center md:mt-6 snap-center">
      <div className="relative">
        <div className="md:rounded-xl overflow-hidden min-w-[250px] w-screen md:w-[350px] ultrawide:w-[407px] h-screen bg-black md:h-[calc(100vh-145px)]">
          <VideoPlayer
            refCallback={refCallback}
            permanentUrl={getPublicationMediaUrl(video)}
            posterUrl={imageCdn(
              sanitizeIpfsUrl(getThumbnailUrl(video)),
              'thumbnail_v'
            )}
            ratio="9to16"
            publicationId={video.id}
            options={{ autoPlay: false, muted: false, loop: true }}
          >
            <ControlsContainer />
          </VideoPlayer>
        </div>
        <TopOverlay playing={playing} onClickPlayPause={onClickVideo} />
        <BottomOverlay video={video} />
        <div className="absolute md:hidden z-[1] right-2 bottom-[15%]">
          <ByteActions video={video} />
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
            <div className="text-center text-white md:text-gray-500">
              <CollectVideo video={video} variant="secondary" />
              <div className="text-xs">
                {video.stats?.totalAmountOfCollects || 'Collect'}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:flex">
        <ByteActions video={video} />
      </div>
    </div>
  )
}

export default ByteVideo
