import "@vidstack/react/player/styles/base.css";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import {
  AirPlayButton,
  Controls,
  FullscreenButton,
  GoogleCastButton,
  MediaAnnouncer,
  MediaPlayer,
  type MediaPlayerInstance,
  type MediaPlayerProps,
  MediaProvider,
  MuteButton,
  PlayButton,
  Poster,
  SeekButton,
  Spinner,
  Time,
  TimeSlider,
  ToggleButton,
  VolumeSlider,
  useMediaPlayer,
  useMediaState
} from "@vidstack/react";
import { forwardRef, memo, useEffect } from "react";
import {
  Airplay,
  ArrowClockwise,
  ArrowCounterClockwise,
  CornersIn,
  CornersOut,
  Pause,
  PictureInPicture,
  Play,
  Screencast,
  SpeakerHigh,
  SpeakerLow,
  SpeakerNone
} from "../icons";
import { tw } from "../tw";

interface Props extends Omit<MediaPlayerProps, "children"> {
  poster?: string;
  posterClassName?: string;
  pip?: boolean;
  top?: React.ReactNode;
}

const VPlayButton = () => (
  <PlayButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-black/5 backdrop-blur-sm hover:bg-black/10">
    <Play className="hidden size-4 group-data-[paused]:block" weight="fill" />
    <Pause className="size-4 group-data-[paused]:hidden" weight="fill" />
  </PlayButton>
);

const VTimeSlider = () => (
  <>
    <TimeSlider.Track className="relative z-0 h-[3px] w-full rounded bg-white/20">
      <TimeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded bg-white will-change-[width]" />
      <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded bg-white/40 will-change-[width]" />
    </TimeSlider.Track>
    <TimeSlider.Thumb className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-[var(--slider-fill)] z-20 h-4 w-1 rounded bg-white opacity-0 transition-opacity duration-200 will-change-[left] group-data-[active]:opacity-100" />
  </>
);

const StreamAV = ({
  className = "*:bg-black/5 *:backdrop-blur-sm *:transition-opacity *:hover:bg-black/10"
}: { className?: string }) => {
  const player = useMediaPlayer();
  const canAirPlay = player?.state.canAirPlay;
  const canGoogleCast = player?.state.canGoogleCast;
  if (!canAirPlay && !canGoogleCast) return null;
  return (
    <span className={tw("inline-flex gap-[6px]", className)}>
      {canGoogleCast ? (
        <GoogleCastButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom ">
          <Screencast className="size-4" weight="bold" />
        </GoogleCastButton>
      ) : canAirPlay ? (
        <AirPlayButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom">
          <Airplay className="size-4" weight="bold" />
        </AirPlayButton>
      ) : null}
    </span>
  );
};

const VTimeSliderRoot = ({ isPortrait }: { isPortrait: boolean }) => {
  const isPaused = useMediaState("paused");

  return (
    <TimeSlider.Root
      className="group relative inline-flex w-full cursor-pointer touch-none select-none items-center py-1.5 aria-hidden:hidden"
      aria-hidden={isPaused && isPortrait}
    >
      <VTimeSlider />
    </TimeSlider.Root>
  );
};

const ClickToPlay = () => {
  const player = useMediaPlayer();

  const onClick = () => {
    if (player?.paused) {
      player?.play();
    }
    player?.pause();
  };

  return (
    <Controls.Group
      className="pointer-events-auto size-full"
      onClick={onClick}
    />
  );
};

const NotInViewObserver = () => {
  const player = useMediaPlayer();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: "0px"
  });
  useEffect(() => {
    if (!entry?.isIntersecting) {
      player?.pause();
    }
  }, [entry?.isIntersecting]);
  return <span ref={ref} />;
};

const BufferIndicator = memo(() => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center">
      <Spinner.Root
        className="media-buffering:animate-spin text-white media-buffering:opacity-100 opacity-0 transition-opacity duration-200 ease-linear"
        size={50}
      >
        <Spinner.Track className="opacity-25" width={5} />
        <Spinner.TrackFill className="opacity-75" width={5} />
      </Spinner.Root>
    </div>
  );
});

const BottomControls = memo(({ pip }: { pip?: boolean }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center gap-[6px]">
        <VPlayButton />
        <SeekButton
          className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-black/5 backdrop-blur-sm transition-opacity hover:bg-black/10"
          seconds={-10}
        >
          <ArrowCounterClockwise className="size-4" weight="bold" />
        </SeekButton>
        <SeekButton
          className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-black/5 backdrop-blur-sm transition-opacity hover:bg-black/10"
          seconds={10}
        >
          <ArrowClockwise className="size-4" weight="bold" />
        </SeekButton>
        <div className="inline-flex h-9 items-center space-x-2 rounded-custom bg-black/5 py-2 pr-4 pl-3 backdrop-blur-sm transition-opacity hover:bg-black/10">
          <MuteButton className="group relative cursor-pointer ">
            <SpeakerNone
              className="hidden size-4 group-data-[state='muted']:block"
              weight="bold"
            />
            <SpeakerLow
              className="hidden size-4 group-data-[state='low']:block"
              weight="bold"
            />
            <SpeakerHigh
              className="hidden size-4 group-data-[state='high']:block"
              weight="bold"
            />
          </MuteButton>
          <VolumeSlider.Root className="group relative inline-flex w-20 cursor-pointer touch-none select-none items-center aria-hidden:hidden">
            <VolumeSlider.Track className="relative z-0 my-1 h-0.5 w-full rounded bg-white/30">
              <VolumeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded bg-white will-change-[width]" />
            </VolumeSlider.Track>
            <VolumeSlider.Thumb className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-[var(--slider-fill)] z-20 h-3 w-0.5 rounded bg-white opacity-0 transition-opacity duration-200 will-change-[left] group-data-[active]:opacity-100" />
          </VolumeSlider.Root>
        </div>
      </div>
      <div className="inline-flex items-center gap-[6px]">
        {pip && (
          <ToggleButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-black/5 backdrop-blur-sm transition-opacity hover:bg-black/10 data-[pressed]:hidden">
            <PictureInPicture className="size-4" weight="bold" />
          </ToggleButton>
        )}
        <StreamAV />
        <FullscreenButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-black/5 backdrop-blur-sm transition-opacity hover:bg-black/10">
          <CornersOut
            className="size-4 group-data-[active]:hidden"
            weight="bold"
          />
          <CornersIn
            className="hidden size-4 group-data-[active]:block"
            weight="bold"
          />
        </FullscreenButton>
      </div>
    </div>
  );
});

const VideoPlayer = forwardRef<MediaPlayerInstance, Props>(
  ({ poster, top, pip, posterClassName, ...props }, ref) => {
    const isPortrait = props.aspectRatio === "9/16";

    return (
      <MediaPlayer
        ref={ref}
        {...props}
        className={tw(
          "aspect-video size-full overflow-hidden bg-black font-sans text-white",
          props.className
        )}
      >
        <NotInViewObserver />
        <MediaProvider onContextMenu={(e) => e.preventDefault()}>
          {poster ? (
            <Poster asChild>
              <img
                className={tw(
                  "absolute inset-0 size-full bg-black object-cover opacity-0 transition-opacity data-[visible]:opacity-100",
                  posterClassName
                )}
                src={poster}
                alt="poster"
                draggable={false}
              />
            </Poster>
          ) : null}
          <Controls.Root className="pointer-events-none absolute inset-0 z-10 flex size-full flex-col opacity-0 transition-opacity data-[visible]:opacity-100">
            <Controls.Group
              className={tw(
                "pointer-events-auto w-full",
                top && "bg-gradient-to-b from-black/40 p-4"
              )}
            >
              {top}
            </Controls.Group>
            <div className="flex-1" />
            <ClickToPlay />
            <div className="flex-1" />
            <Controls.Group className="pointer-events-auto flex w-full flex-col gap-[6px] bg-gradient-to-t from-black/40 p-4">
              <div className="flex items-center gap-[6px]">
                {!isPortrait ? (
                  <div className="mr-2 flex items-center font-semibold text-sm">
                    <Time className="tabular-nums" type="current" />
                    <div className="mx-1 text-white/80">/</div>
                    <Time className="tabular-nums" type="duration" />
                  </div>
                ) : null}
                <VTimeSliderRoot isPortrait={isPortrait} />
              </div>
              {!isPortrait && <BottomControls pip={pip} />}
            </Controls.Group>
          </Controls.Root>
          <BufferIndicator />
        </MediaProvider>
        <MediaAnnouncer />
      </MediaPlayer>
    );
  }
);

export { VideoPlayer, VPlayButton, NotInViewObserver, VTimeSlider, StreamAV };
