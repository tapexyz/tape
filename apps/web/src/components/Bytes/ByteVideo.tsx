import CollectVideo from '@components/Watch/CollectVideo'
import { ControlsContainer } from '@livepeer/react'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { useInView } from 'react-cool-inview'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: Publication
}

const ByteVideo: FC<Props> = ({ video }) => {
  const videoRef = useRef<HTMLMediaElement>()
  const thumbnailUrl = imageCdn(
    sanitizeIpfsUrl(getThumbnailUrl(video)),
    'thumbnail_v'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, true)

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
      const nextUrl = `${location.origin}/bytes/${video?.id}`
      history.replaceState({ path: nextUrl }, '', nextUrl)
      playVideo()
    }
  })

  return (
    <div ref={observe} className="flex snap-center justify-center md:mt-6">
      <div className="relative">
        <div
          className="ultrawide:w-[407px] flex h-screen w-screen min-w-[250px] items-center overflow-hidden bg-black md:h-[calc(100vh-145px)] md:w-[350px] md:rounded-xl"
          style={{
            backgroundColor: backgroundColor && `${backgroundColor}95`
          }}
        >
          <VideoPlayer
            refCallback={refCallback}
            permanentUrl={getPublicationMediaUrl(video)}
            posterUrl={thumbnailUrl}
            ratio="9to16"
            publicationId={video.id}
            options={{
              autoPlay: false,
              muted: false,
              loop: true,
              loadingSpinner: false
            }}
          >
            <ControlsContainer />
          </VideoPlayer>
        </div>
        <TopOverlay onClickVideo={onClickVideo} />
        <BottomOverlay video={video} />
        <div className="absolute right-2 bottom-[15%] z-[1] md:hidden">
          <ByteActions video={video} />
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
            <div className="text-center text-white md:text-gray-500">
              <CollectVideo video={video} />
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
