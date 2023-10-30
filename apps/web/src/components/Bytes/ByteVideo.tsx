import useProfileStore from '@lib/store/profile'
import {
  getPublication,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
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

  const { activeProfile } = useProfileStore()
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(targetPublication.metadata, true)),
    'THUMBNAIL_V'
  )

  const playVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.currentTime = 0
    videoRef.current.volume = 1
    videoRef.current.autoplay = true
    videoRef.current?.play().catch(() => {})
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
    <div className="mb-6 flex snap-center justify-center md:ml-16">
      <div className="relative">
        <div className="ultrawide:w-[650px] rounded-large flex h-[calc(100vh-10rem)] w-[calc(100vw-80px)] items-center overflow-hidden bg-black md:h-[calc(100vh-120px)] md:w-[420px]">
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={targetPublication?.id}
          />
          <VideoPlayer
            address={activeProfile?.ownedBy.address}
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
