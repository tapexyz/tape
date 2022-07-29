import usePlayerStore from '@lib/store/player'
import React, { FC, RefObject } from 'react'

export type VideoRefOnly = {
  videoRef: RefObject<HTMLVideoElement>
}

const Video: FC<VideoRefOnly> = ({ videoRef }) => {
  const { playing, setPlaying, togglePlay } = usePlayerStore()

  const onClickVideo = () => {
    togglePlay({ videoRef })
    setPlaying(!playing)
  }

  return (
    <video
      controlsList="nodownload"
      className="aspect-video rounded-xl"
      src="https://livepeercdn.com/asset/5f86c5tcrnezabww/video"
      ref={videoRef}
      onClick={onClickVideo}
    />
  )
}

export default Video
