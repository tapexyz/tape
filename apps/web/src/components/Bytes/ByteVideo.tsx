import { Analytics, TRACK } from '@lenstube/browser'
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
      className="mb-6 flex snap-center justify-center first:mt-6"
      data-testid="byte-video"
    >
      <div className="relative">
        <div className="ultrawide:w-[650px] flex h-[800px] w-[calc(100vw-80px)] items-center overflow-hidden rounded-md bg-black md:h-[calc(100vh-100px)] md:w-[620px]">
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={targetPublication?.id}
          />
          <VideoPlayer
            address={selectedSimpleProfile?.ownedBy.address}
            refCallback={refCallback}
            url={getPublicationMediaUrl(targetPublication.metadata)}
            posterUrl={thumbnailUrl}
            ratio="9to16"
            showControls={false}
            options={{
              autoPlay: currentViewingId === targetPublication.id,
              muted: currentViewingId !== targetPublication.id,
              loop: true,
              loadingSpinner: false,
              isCurrentlyShown: currentViewingId === video.id
            }}
          />
        </div>
        <TopOverlay onClickVideo={onClickVideo} />
        <BottomOverlay video={targetPublication} />
      </div>
      <ByteActions video={targetPublication} />
    </div>
  )
}

export default React.memo(ByteVideo)
