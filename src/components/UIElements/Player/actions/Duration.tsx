import usePlayerStore from '@lib/store/player'
import { getTimeFromSeconds } from '@utils/functions/formatTime'
import { FC, useEffect, useState } from 'react'
import React from 'react'

import { VideoRefOnly } from '../Video'

const Duration: FC<VideoRefOnly> = ({ videoRef }) => {
  const { setCurrentTime, setDuration, duration } = usePlayerStore()
  const [playingStamp, setPlayingStamp] = useState('00:00')

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.ontimeupdate = () => {
      if (videoRef.current?.currentTime) {
        const stamp = getTimeFromSeconds(
          videoRef.current?.currentTime.toString()
        )
        setCurrentTime(videoRef.current?.currentTime)
        setPlayingStamp(stamp)
      }
    }
    videoRef.current.onloadedmetadata = () => {
      if (videoRef.current?.duration) setDuration(videoRef.current?.duration)
    }
  }, [videoRef, setCurrentTime, setDuration])

  return (
    <div className="flex items-center space-x-1 text-xs opacity-80 md:text-sm">
      <span>{playingStamp}</span>
      <span>/</span>
      <span>{getTimeFromSeconds(duration.toString())}</span>
    </div>
  )
}

export default Duration
