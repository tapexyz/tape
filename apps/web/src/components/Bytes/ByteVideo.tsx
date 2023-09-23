import CollectVideo from '@components/Watch/CollectVideo'
import { Analytics, TRACK, useAverageColor } from '@lenstube/browser'
import {
  getPublication,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type { AnyPublication } from '@lenstube/lens'
import VideoPlayer from '@lenstube/ui/VideoPlayer'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: AnyPublication
  currentViewingId: string
  intersectionCallback: (id: string) => void
}

const ByteVideo: FC<Props> = ({
  video,
  currentViewingId,
  intersectionCallback
}) => {
  const videoRef = useRef<HTMLMediaElement>()
  const intersectionRef = useRef<HTMLDivElement>(null)
  const targetPublication = getPublication(video)

  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(targetPublication, true)),
    'THUMBNAIL_V'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, true)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const playVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.currentTime = 0
    videoRef.current.volume = 1
    videoRef.current.autoplay = true
    videoRef.current?.play().catch(() => {})
    Analytics.track(TRACK.PLAY_BYTE_VIDEO)
  }

  const observer = new IntersectionObserver((data) => {
    if (data[0].target.id && data[0].isIntersecting) {
      intersectionCallback(data[0].target.id)
      const nextUrl = `${location.origin}/bytes/${targetPublication?.id}`
      history.replaceState({ path: nextUrl }, '', nextUrl)
    }
  })

  useEffect(() => {
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pauseVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.volume = 0
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
    if (!ref) {
      return
    }
    videoRef.current = ref
    playVideo()
  }

  if (!video) {
    return null
  }

  return (
    <div
      className="flex snap-center justify-center md:mt-6"
      data-testid="byte-video"
    >
      <div className="relative">
        <div
          className="ultrawide:w-[650px] flex h-screen w-screen min-w-[250px] items-center overflow-hidden bg-black md:h-[calc(100vh-145px)] md:w-[400px] md:rounded-xl"
          style={{
            backgroundColor: backgroundColor ? backgroundColor : undefined
          }}
        >
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={targetPublication?.id}
          />
          {currentViewingId === targetPublication.id ? (
            <VideoPlayer
              address={selectedSimpleProfile?.ownedBy.address}
              refCallback={refCallback}
              url={getPublicationMediaUrl(targetPublication.metadata)}
              posterUrl={thumbnailUrl}
              ratio="9to16"
              showControls={false}
              options={{
                autoPlay: false,
                muted: false,
                loop: true,
                loadingSpinner: false,
                isCurrentlyShown: currentViewingId === video.id
              }}
            />
          ) : (
            <div className="h-full w-full">
              <img
                className="w-full object-cover"
                src={thumbnailUrl}
                alt="thumbnail"
                draggable={false}
              />
              <span className="invisible absolute">
                <VideoPlayer
                  url={getPublicationMediaUrl(targetPublication.metadata)}
                  showControls={false}
                  options={{
                    autoPlay: false,
                    muted: true,
                    loadingSpinner: false,
                    isCurrentlyShown: currentViewingId === targetPublication.id
                  }}
                />
              </span>
            </div>
          )}
        </div>
        <TopOverlay onClickVideo={onClickVideo} />
        <BottomOverlay video={targetPublication} />
        <div className="absolute bottom-[15%] right-2 z-[1] md:hidden">
          <ByteActions video={targetPublication} />
          <div className="pt-3 text-center text-white md:text-gray-500">
            <CollectVideo video={targetPublication} variant="none" />
            <div className="text-xs">
              {targetPublication.stats?.countOpenActions || t`Collect`}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex">
        <ByteActions video={targetPublication} />
      </div>
    </div>
  )
}

export default React.memo(ByteVideo)
