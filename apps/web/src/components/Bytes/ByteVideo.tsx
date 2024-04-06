import MetaTags from '@components/Common/MetaTags'
import {
  getPublication,
  getPublicationData,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import { VideoPlayer } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { memo, useEffect, useRef } from 'react'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'

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
  const intersectionRef = useRef<HTMLDivElement>(null)
  const targetPublication = getPublication(video)

  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(targetPublication.metadata, true)),
    'THUMBNAIL_V'
  )
  const title = getPublicationData(targetPublication.metadata)?.title

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

  if (!video) {
    return null
  }

  return (
    <div className="keen-slider__slide flex snap-center justify-center focus-visible:outline-none md:ml-16 md:pb-2">
      <MetaTags title={title} />
      <div className="rounded-large relative overflow-hidden">
        <div
          className="rounded-large flex h-full w-[calc(100vw-80px)] items-center overflow-hidden bg-black md:w-[650px]"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        >
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={targetPublication?.id}
          />
          {currentViewingId === targetPublication.id && (
            <VideoPlayer
              url={getPublicationMediaUrl(targetPublication.metadata)}
              title={
                getPublicationData(targetPublication.metadata)?.title || ''
              }
              poster={thumbnailUrl}
              aspectRatio={null}
              showControls={false}
              loop={true}
            />
          )}
        </div>
        <BottomOverlay video={targetPublication} />
      </div>
      <ByteActions video={targetPublication} />
    </div>
  )
}

export default memo(ByteVideo)
