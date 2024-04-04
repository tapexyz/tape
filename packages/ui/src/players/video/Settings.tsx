import { SettingsIcon } from '@livepeer/react/assets'
import * as Player from '@livepeer/react/player'
import * as Popover from '@radix-ui/react-popover'
import type { Ref } from 'react'
import { forwardRef } from 'react'

import { ChevronDownOutline, TimesOutline } from '../../icons'
import PlaybackRateSelectItem from './PlaybackRateSelectItem'
import VideoQualitySelectItem from './VideoQualitySelectItem'

const Settings = forwardRef(
  (
    { className }: { className?: string },
    ref: Ref<HTMLButtonElement> | undefined
  ) => {
    return (
      <Popover.Root>
        <Popover.Trigger ref={ref} asChild>
          <button
            type="button"
            className={className}
            aria-label="Playback settings"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsIcon />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-60 rounded-lg border border-gray-700 bg-black/50 p-3 pb-5 shadow outline-none backdrop-blur-md"
            side="top"
            alignOffset={-70}
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <p className="mb-1 font-medium text-white/90">Settings</p>
              <Player.LiveIndicator
                matcher={false}
                className="flex flex-col gap-2"
              >
                <label
                  className="text-xs font-medium text-white/90"
                  htmlFor="speedSelect"
                >
                  Playback speed
                </label>
                <Player.RateSelect name="speedSelect">
                  <Player.SelectTrigger
                    className="inline-flex h-7 items-center justify-between gap-1 rounded px-2 text-xs leading-none text-white outline-none outline-1 outline-white/50"
                    aria-label="Playback speed"
                  >
                    <Player.SelectValue placeholder="Select a speed..." />
                    <Player.SelectIcon>
                      <ChevronDownOutline className="size-3" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden rounded-lg bg-black">
                      <Player.SelectViewport className="p-1">
                        <Player.SelectGroup>
                          <PlaybackRateSelectItem value={0.5}>
                            0.5x
                          </PlaybackRateSelectItem>
                          <PlaybackRateSelectItem value={0.75}>
                            0.75x
                          </PlaybackRateSelectItem>
                          <PlaybackRateSelectItem value={1}>
                            1x (normal)
                          </PlaybackRateSelectItem>
                          <PlaybackRateSelectItem value={1.25}>
                            1.25x
                          </PlaybackRateSelectItem>
                          <PlaybackRateSelectItem value={1.5}>
                            1.5x
                          </PlaybackRateSelectItem>
                          <PlaybackRateSelectItem value={1.75}>
                            1.75x
                          </PlaybackRateSelectItem>
                          <PlaybackRateSelectItem value={2}>
                            2x
                          </PlaybackRateSelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.RateSelect>
              </Player.LiveIndicator>
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-medium text-white/90"
                  htmlFor="qualitySelect"
                >
                  Quality
                </label>
                <Player.VideoQualitySelect
                  name="qualitySelect"
                  defaultValue="1.0"
                >
                  <Player.SelectTrigger
                    className="inline-flex h-7 items-center justify-between gap-1 rounded px-2 text-xs leading-none text-white outline-none outline-1 outline-white/50"
                    aria-label="Playback quality"
                  >
                    <Player.SelectValue placeholder="Select a quality..." />
                    <Player.SelectIcon>
                      <ChevronDownOutline className="size-3" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden rounded-lg bg-black">
                      <Player.SelectViewport className="p-[5px]">
                        <Player.SelectGroup>
                          <VideoQualitySelectItem value="auto">
                            Auto (HD+)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="1080p">
                            1080p (HD)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="720p">
                            720p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="480p">
                            480p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="360p">
                            360p
                          </VideoQualitySelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.VideoQualitySelect>
              </div>
            </div>
            <Popover.Close
              className="absolute right-2.5 top-3.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-white outline-none"
              aria-label="Close"
            >
              <TimesOutline outlined={false} className="size-2.5" />
            </Popover.Close>
            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  }
)
Settings.displayName = 'Settings'

export default Settings
