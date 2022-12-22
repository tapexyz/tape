import CollectVideo from '@components/Watch/CollectVideo'
import { ControlsContainer } from '@livepeer/react'
import type { FC } from 'react'
import React, { useRef } from 'react'
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
  const videoRef = useRef<HTMLMediaElement>()

  const playVideo = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.volume = 1
    videoRef.current.autoplay = true
    videoRef.current?.play().catch(() => {})
  }

  const pauseVideo = () => {
    if (!videoRef.current) return
    videoRef.current?.pause()
    videoRef.current.autoplay = false
  }

  const onClickVideo = () => {
    if (videoRef.current?.paused) {
      playVideo()
    } else {
      pauseVideo()
    }
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    videoRef.current = ref
  }

  const { observe } = useInView({
    threshold: 1,
    onLeave: () => {
      if (!videoRef.current) return
      pauseVideo()
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
        <TopOverlay onClickVideo={onClickVideo} />
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
