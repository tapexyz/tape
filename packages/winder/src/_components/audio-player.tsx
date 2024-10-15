import {
  MediaAnnouncer,
  MediaPlayer,
  type MediaPlayerInstance,
  type MediaPlayerProps,
  MediaProvider,
  PlayButton,
  Poster,
  SeekButton,
  Time,
  TimeSlider,
  ToggleButton,
  useMediaPlayer,
  usePlaybackRateOptions
} from "@vidstack/react";
import { forwardRef } from "react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Heart,
  Lightning,
  Pause,
  PictureInPicture,
  Play
} from "../icons";
import { tw } from "../tw";
import { NotInViewObserver, StreamAV, VTimeSlider } from "./video-player";

interface Props extends Omit<MediaPlayerProps, "children"> {
  poster?: string;
  pip?: boolean;
  layout?: "horizontal" | "vertical";
}

const MediaSpeed = () => {
  const player = useMediaPlayer();
  const playbackRates = [0.25, 0.5, 1, 1.5, 2];
  const { selectedValue } = usePlaybackRateOptions();

  const handlePlaybackRateChange = () => {
    if (!player || !selectedValue) return;
    const currentRateIndex = playbackRates.indexOf(Number(selectedValue));
    const nextRateIndex = (currentRateIndex + 1) % playbackRates.length;
    const nextRate = playbackRates[nextRateIndex] ?? 1;
    player.playbackRate = nextRate;
  };

  return (
    <button
      type="button"
      onClick={handlePlaybackRateChange}
      className="w-14 text-left tabular-nums opacity-70 hover:opacity-100"
    >
      {selectedValue}x
    </button>
  );
};

const AudioPlayer = forwardRef<MediaPlayerInstance, Props>(
  ({ poster, pip, layout = "vertical", ...props }, ref) => {
    return (
      <MediaPlayer
        ref={ref}
        {...props}
        className={tw("font-sans text-white", props.className)}
      >
        <NotInViewObserver />
        <MediaProvider>
          <div
            className={tw(
              "flex w-full flex-1 gap-[6px]",
              layout === "vertical" ? "flex-col" : "h-60 flex-row"
            )}
          >
            <Poster asChild>
              <img
                className="block aspect-square rounded-card-sm border border-custom bg-theme object-cover transition-opacity"
                src={poster}
                alt="poster"
                draggable={false}
              />
            </Poster>

            <div className="flex size-full flex-col justify-between gap-10 rounded-card-sm bg-[#494949] p-4">
              <div className="flex w-full items-center gap-[6px] space-x-2 text-sm">
                <MediaSpeed />
                <Time className="tabular-nums" type="current" />
                <TimeSlider.Root className="group relative inline-flex w-full cursor-pointer touch-none select-none items-center py-1.5 aria-hidden:hidden">
                  <VTimeSlider />
                </TimeSlider.Root>
                <Time className="tabular-nums" type="duration" />
              </div>
              <div className="flex justify-between">
                <div className="inline-flex gap-[6px]">
                  <StreamAV className="*:bg-white/10 *:transition-opacity *:hover:bg-white/5" />
                  <div className="inline-flex">
                    <ToggleButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom hover:text-white/80">
                      <Heart className="size-5" />
                    </ToggleButton>
                    <ToggleButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom hover:text-white/80">
                      <Lightning className="size-5" />
                    </ToggleButton>
                  </div>
                </div>
                <div className="flex gap-[6px]">
                  <ToggleButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 hover:bg-white/5">
                    <PictureInPicture className="size-4" weight="bold" />
                  </ToggleButton>
                  <SeekButton
                    className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 hover:bg-white/5"
                    seconds={-10}
                  >
                    <ArrowCounterClockwise className="size-4" weight="bold" />
                  </SeekButton>
                  <SeekButton
                    className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 hover:bg-white/5"
                    seconds={10}
                  >
                    <ArrowClockwise className="size-4" weight="bold" />
                  </SeekButton>
                  <PlayButton className="group inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white text-black hover:bg-white/90">
                    <Play
                      className="hidden size-4 group-data-[paused]:block"
                      weight="fill"
                    />
                    <Pause
                      className="size-4 group-data-[paused]:hidden"
                      weight="fill"
                    />
                  </PlayButton>
                </div>
              </div>
            </div>
          </div>
        </MediaProvider>
        <MediaAnnouncer />
      </MediaPlayer>
    );
  }
);

export { AudioPlayer, StreamAV };
