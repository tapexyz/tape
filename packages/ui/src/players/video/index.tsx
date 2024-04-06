import type { Src } from '@livepeer/react'
import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  UnmuteIcon
} from '@livepeer/react/assets'
import { getSrc } from '@livepeer/react/external'
import * as Player from '@livepeer/react/player'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { PlayerLoading } from './PlayerLoading'
import SensitiveWarning from './SensitiveWarning'
import Settings from './Settings'

type Props = {
  url: string
  title: string
  loop?: boolean
  poster: string
  timestamp?: number
  aspectRatio?: number | null
  showControls?: boolean
  isSensitiveContent?: boolean
}

export const VideoPlayer: FC<Props> = (props) => {
  const {
    url,
    title,
    loop = false,
    poster,
    timestamp = 0,
    aspectRatio = 16 / 9,
    showControls = true,
    isSensitiveContent = false
  } = props
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number.isFinite(timestamp) ? timestamp : 0
    }
  }, [timestamp])

  const vodSource = {
    type: 'vod',
    meta: {
      playbackPolicy: null,
      source: [
        {
          hrn: 'HLS (TS)',
          type: 'html5/application/vnd.apple.mpegurl',
          url
        }
      ]
    }
  }

  const src = url.includes('.m3u8')
    ? getSrc(vodSource)
    : ([{ src: url, type: 'video', mime: 'video/mp4' }] as Src[])

  const togglePlay = () => {
    if (!videoRef.current) {
      return
    }

    if (videoRef.current.paused) {
      return videoRef.current.play()
    }
    videoRef.current.pause()
  }

  if (sensitiveWarning) {
    return <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
  }

  return (
    <Player.Root src={src} aspectRatio={aspectRatio} autoPlay preload="auto">
      <Player.Container className="h-full w-full overflow-hidden bg-black outline-none transition">
        <Player.Video
          ref={videoRef}
          title={title}
          className="h-full w-full object-cover transition"
          onClick={() => togglePlay()}
          onContextMenu={(e) => e.preventDefault()}
          poster={poster}
          loop={loop}
        />

        {!showControls && (
          <div className="absolute right-5 top-5 z-10">
            <Player.PlayPauseTrigger className="ultrawide:size-8 size-6 flex-shrink-0 text-white transition hover:scale-110">
              <Player.PlayingIndicator asChild matcher={false}>
                <PlayIcon className="h-full w-full" />
              </Player.PlayingIndicator>
              <Player.PlayingIndicator asChild>
                <PauseIcon className="h-full w-full" />
              </Player.PlayingIndicator>
            </Player.PlayPauseTrigger>
          </div>
        )}

        <Player.LoadingIndicator className="data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 relative h-full w-full bg-black/50 backdrop-blur">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="size-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.LoadingIndicator>

        <Player.Poster src={poster} title={title} />

        <Player.ErrorIndicator
          matcher="all"
          className="data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="size-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="offline"
          className="animate-in fade-in-0 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-bold sm:text-2xl">
                Stream is offline
              </div>
              <div className="text-xs text-gray-100 sm:text-sm">
                Playback will start automatically once the stream has started
              </div>
            </div>
            <LoadingIcon className="mx-auto size-6 animate-spin md:size-8" />
          </div>
        </Player.ErrorIndicator>

        {showControls && (
          <Player.Controls className="data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 flex flex-col-reverse gap-1 bg-gradient-to-b from-black/5 via-black/30 via-80% to-black/60 px-3 py-2 text-white duration-1000 md:px-3">
            <div className="flex justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Player.PlayPauseTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                  <Player.PlayingIndicator asChild matcher={false}>
                    <PlayIcon className="h-full w-full" />
                  </Player.PlayingIndicator>
                  <Player.PlayingIndicator asChild>
                    <PauseIcon className="h-full w-full" />
                  </Player.PlayingIndicator>
                </Player.PlayPauseTrigger>

                <Player.MuteTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                  <Player.VolumeIndicator asChild matcher={false}>
                    <MuteIcon className="h-full w-full" />
                  </Player.VolumeIndicator>
                  <Player.VolumeIndicator asChild matcher={true}>
                    <UnmuteIcon className="h-full w-full" />
                  </Player.VolumeIndicator>
                </Player.MuteTrigger>

                <Player.Volume className="group relative mr-1 flex h-5 max-w-[120px] flex-1 cursor-pointer touch-none select-none items-center">
                  <Player.Track className="relative h-[2px] grow rounded-full bg-white/30 transition group-hover:h-[3px] md:h-[3px] group-hover:md:h-[4px]">
                    <Player.Range className="absolute h-full rounded-full bg-white" />
                  </Player.Track>
                  <Player.Thumb className="block h-3 w-3 rounded-full bg-white transition group-hover:scale-110" />
                </Player.Volume>

                <Player.LiveIndicator className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  <span className="select-none text-sm">LIVE</span>
                </Player.LiveIndicator>
                <Player.LiveIndicator
                  matcher={false}
                  className="flex items-center gap-2"
                >
                  <Player.Time className="select-none text-sm" />
                </Player.LiveIndicator>
              </div>
              <div className="flex items-center justify-end gap-2.5 sm:flex-1 md:flex-[1.5]">
                <Player.FullscreenIndicator matcher={false} asChild>
                  <Settings className="size-6 flex-shrink-0 transition" />
                </Player.FullscreenIndicator>

                <Player.PictureInPictureTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                  <PictureInPictureIcon className="h-full w-full" />
                </Player.PictureInPictureTrigger>

                <Player.FullscreenTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                  <Player.FullscreenIndicator asChild>
                    <ExitFullscreenIcon className="h-full w-full" />
                  </Player.FullscreenIndicator>

                  <Player.FullscreenIndicator matcher={false} asChild>
                    <EnterFullscreenIcon className="h-full w-full" />
                  </Player.FullscreenIndicator>
                </Player.FullscreenTrigger>
              </div>
            </div>
            <Player.Seek className="group relative flex h-5 w-full cursor-pointer touch-none select-none items-center">
              <Player.Track className="relative h-[2px] grow rounded-full bg-white/30 transition group-hover:h-[3px] md:h-[3px] group-hover:md:h-[4px]">
                <Player.SeekBuffer className="absolute h-full rounded-full bg-black/30 transition duration-1000" />
                <Player.Range className="absolute h-full rounded-full bg-white" />
              </Player.Track>
              <Player.Thumb className="block h-3 w-3 rounded-full bg-white transition group-hover:scale-110" />
            </Player.Seek>
          </Player.Controls>
        )}
      </Player.Container>
    </Player.Root>
  )
}
