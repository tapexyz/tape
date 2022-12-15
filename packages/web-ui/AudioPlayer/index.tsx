import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { BiPause, BiPlay } from 'react-icons/bi'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi'
import type { LenstubePublication } from 'utils/custom-types'
import { getTimeFromSeconds } from 'utils/functions/formatTime'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import type WaveSurfer from 'wavesurfer.js'

type Props = {
  selectedTrack: LenstubePublication
}

const AudioPlayer: FC<Props> = ({ selectedTrack }) => {
  const waveformRef = useRef<HTMLDivElement>(null)
  const waveSurfer = useRef<WaveSurfer>()
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentPlayingTime, setCurrentPlayingTime] = useState('00:00')
  const [duration, setDuration] = useState('00:00')

  const getAudioPlayerOptions = (ref: HTMLDivElement) => ({
    container: ref,
    waveColor: 'gray',
    progressColor: '#81c7af',
    cursorColor: 'orangered',
    cursorWidth: 2,
    barWidth: 1,
    barRadius: 3,
    hideScrollbar: true,
    responsive: true,
    height: 20,
    normalize: true,
    partialRender: true
  })

  const playTrack = () => {
    waveSurfer.current?.play()
    setPlaying(true)
  }

  const setPlayerVolume = (volumeToSet: number) => {
    const userVolume = volumeToSet ?? volume
    waveSurfer.current?.setVolume(userVolume)
    setVolume(userVolume)
  }

  const createPlayer = async () => {
    const WaveSurfer = (await import('wavesurfer.js')).default
    if (!waveformRef.current) return
    const options = getAudioPlayerOptions(waveformRef.current)
    waveSurfer.current = WaveSurfer.create(options)
    if (selectedTrack)
      waveSurfer.current?.load(getPublicationMediaUrl(selectedTrack))

    waveSurfer.current.on('ready', () => {
      playTrack()
      setPlayerVolume(volume)
      const duration = getTimeFromSeconds(
        waveSurfer.current?.getDuration().toString() ?? '0'
      )
      setDuration(duration ?? '0')
    })
    waveSurfer.current.on('audioprocess', (time) => {
      setCurrentPlayingTime(getTimeFromSeconds(time.toString()) ?? '0')
    })
    waveSurfer.current.on('finish', () => {
      setPlaying(false)
    })
  }

  useEffect(() => {
    setPlaying(false)
    createPlayer()
    return () => {
      if (waveSurfer.current) {
        waveSurfer.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack])

  const handlePlayPause = () => {
    setPlaying(!playing)
    waveSurfer.current?.playPause()
  }

  const rewind = () => {
    if (waveSurfer.current) {
      const current = waveSurfer.current.getCurrentTime()
      waveSurfer.current?.setCurrentTime(current > 5 ? Number(current - 5) : 0)
    }
  }

  const forward = () => {
    if (waveSurfer.current) {
      const current = waveSurfer.current.getCurrentTime()
      waveSurfer.current?.setCurrentTime(Number(current + 5))
    }
  }

  const onChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerVolume(Number(event.target.value) / 100)
  }

  const onClickVolume = () => {
    waveSurfer.current?.toggleMute()
  }

  if (!selectedTrack) return null

  return (
    <div className="flex flex-row flex-wrap items-center w-full gap-y-2 md:flex-nowrap">
      <div className="flex items-center w-1/2">
        <div className="flex">
          <div className="flex-none w-16 h-16">
            <img
              src={getThumbnailUrl(selectedTrack)}
              width={500}
              height={500}
              className="w-full h-full"
              alt={selectedTrack.metadata.name ?? 'cover'}
            />
          </div>
          <div className="flex flex-col justify-between mx-4">
            <h5 className="line-clamp-1">{selectedTrack.metadata.name}</h5>
            <Link
              href={`/channel/${selectedTrack?.profile?.handle}`}
              className="text-[11px] hover:underline font-medium uppercase truncate opacity-90"
            >
              {selectedTrack.profile.handle}
            </Link>
            <div className="flex items-center text-xs">
              <div className="w-10">{currentPlayingTime}</div>
              <span className="pr-0.5">/</span>
              <div className="w-10 text-center">{duration}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div id="waveform" className="w-full m-2" ref={waveformRef} />
        <div className="flex items-center justify-between w-full">
          {/* <Reactions selectedTrack={selectedTrack} /> */}
          <div className="flex items-center space-x-4">
            <button onClick={rewind} className="flex items-center space-x-1">
              <FiChevronLeft /> <span>5</span>
            </button>
            <button
              onClick={handlePlayPause}
              className="p-2 mx-4 text-white bg-black rounded-full outline-none dark:text-black dark:bg-white"
            >
              {playing ? (
                <BiPause className="text-xl" />
              ) : (
                <BiPlay className="text-xl pl-0.5" />
              )}
            </button>
            <button onClick={forward} className="flex items-center space-x-1">
              <span>5</span>
              <FiChevronRight />
            </button>
          </div>
          <div className="flex items-center">
            <button onClick={() => onClickVolume()}>
              {waveSurfer.current?.getMute() ? (
                <GiSpeakerOff className="w-5 h-5" />
              ) : (
                <GiSpeaker className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              step={10}
              value={volume * 100}
              onChange={onChangeVolume}
              className="rounded-lg dark:bg-indigo-900 bg-indigo-100 w-[100px] appearance-none cursor-pointer h-1 overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
