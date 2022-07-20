import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { getVideoUrl } from '@utils/functions/getVideoUrl'
import imageCdn from '@utils/functions/imageCdn'
import { useRouter } from 'next/router'
import React, { FC, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { LenstubePublication } from 'src/types/local'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: LenstubePublication
}

const ByteVideo: FC<Props> = ({ video }) => {
  const router = useRouter()
  const [playing, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onClickVideo = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
      setIsPlaying(true)
    } else {
      videoRef.current?.pause()
      setIsPlaying(false)
    }
  }

  const { observe } = useInView({
    threshold: 1,
    onLeave: () => {
      videoRef.current?.pause()
      setIsPlaying(false)
      router.push(`/bytes/${video.id}`, undefined, { shallow: true })
    },
    onEnter: () => {
      videoRef.current?.load()
      videoRef.current?.play()
      setIsPlaying(true)
      router.push(`/bytes/${video.id}`, undefined, { shallow: true })
    }
  })

  return (
    <div ref={observe} className="flex justify-center md:mt-5 snap-center">
      <div className="relative">
        <video
          onContextMenu={(event) => event.preventDefault()}
          onClick={() => onClickVideo()}
          ref={videoRef}
          disableRemotePlayback
          width="345"
          poster={imageCdn(getThumbnailUrl(video), 'thumbnail_v')}
          className="md:rounded-xl min-w-[250px] w-[345px] 2xl:w-[450px] h-[78vh] bg-black md:h-[calc(100vh-9em)]"
          loop={true}
        >
          <source src={getVideoUrl(video)} type="video/mp4" />
        </video>
        <TopOverlay playing={playing} onClickPlayPause={onClickVideo} />
        <BottomOverlay video={video} />
        <div ref={observe} />
      </div>
      <ByteActions video={video} />
    </div>
  )
}

export default ByteVideo
