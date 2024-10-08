import "@vidstack/react/player/styles/base.css";
import {
  Controls,
  FullscreenButton,
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
  VolumeSlider
} from "@vidstack/react";
import { forwardRef } from "react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CornersIn,
  CornersOut,
  Pause,
  PictureInPicture,
  Play,
  SpeakerHigh,
  SpeakerLow,
  SpeakerNone
} from "../icons";
import { tw } from "../tw";

interface Props extends Omit<MediaPlayerProps, "children"> {
  src: string;
  poster: string;
  pip?: boolean;
  top?: React.ReactNode;
}

const VideoPlayer = forwardRef<MediaPlayerInstance, Props>(
  ({ src, poster, top, pip, ...props }, ref) => {
    return (
      <MediaPlayer
        ref={ref}
        className="aspect-video size-full overflow-hidden bg-black font-sans text-white"
        src={{ src, type: "video/mp4" }}
        {...props}
      >
        <MediaProvider className="size-full object-cover">
          <Poster asChild>
            <img
              className="absolute inset-0 block size-full bg-black object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
              src={poster}
              alt="poster"
              draggable={false}
            />
          </Poster>
          <Controls.Root className="pointer-events-none absolute inset-0 z-10 flex size-full flex-col opacity-0 transition-opacity data-[visible]:opacity-100">
            <Controls.Group
              className={tw(
                "pointer-events-auto w-full",
                top && "bg-gradient-to-b from-black/40 p-2 md:p-4"
              )}
            >
              {top}
            </Controls.Group>
            <div className="flex-1" />
            <Controls.Group className="pointer-events-auto flex w-full flex-col gap-[6px] bg-gradient-to-t from-black/40 p-2 md:p-4">
              <div className="flex items-center gap-[6px]">
                <div className="flex items-center font-semibold text-sm">
                  <Time className="tabular-nums" type="current" />
                  <div className="mx-1 text-white/80">/</div>
                  <Time className="tabular-nums" type="duration" />
                </div>
                <TimeSlider.Root className="group relative mx-[7.5px] inline-flex w-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden md:h-10">
                  <TimeSlider.Track className="relative z-0 h-[3px] w-full rounded bg-white/30">
                    <TimeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded bg-white will-change-[width]" />
                    <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded bg-white/50 will-change-[width]" />
                  </TimeSlider.Track>
                  <TimeSlider.Thumb className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-[var(--slider-fill)] z-20 h-4 w-1 rounded bg-white opacity-0 transition-opacity duration-200 will-change-[left] group-data-[active]:opacity-100" />
                </TimeSlider.Root>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex w-full items-center gap-[6px]">
                  <PlayButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15">
                    <Play
                      className="hidden size-4 group-data-[paused]:block"
                      weight="fill"
                    />
                    <Pause
                      className="size-4 group-data-[paused]:hidden"
                      weight="fill"
                    />
                  </PlayButton>
                  <SeekButton
                    className="group relative hidden size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15 md:inline-flex"
                    seconds={-10}
                  >
                    <ArrowCounterClockwise className="size-4" />
                  </SeekButton>
                  <SeekButton
                    className="group relative hidden size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15 md:inline-flex"
                    seconds={10}
                  >
                    <ArrowClockwise className="size-4" />
                  </SeekButton>
                  <div className="inline-flex h-9 items-center space-x-2 rounded-custom bg-white/10 py-2 pr-3 pl-3 outline-none backdrop-blur-2xl hover:bg-white/15 md:pr-4">
                    <MuteButton className="group relative cursor-pointer outline-none">
                      <SpeakerNone className="hidden size-4 group-data-[state='muted']:block" />
                      <SpeakerLow className="hidden size-4 group-data-[state='low']:block" />
                      <SpeakerHigh className="hidden size-4 group-data-[state='high']:block" />
                    </MuteButton>
                    <VolumeSlider.Root className="group relative hidden w-20 cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden md:inline-flex">
                      <VolumeSlider.Track className="relative z-0 my-1 h-0.5 w-full rounded bg-white/30">
                        <VolumeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded bg-white will-change-[width]" />
                      </VolumeSlider.Track>
                      <VolumeSlider.Thumb className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-[var(--slider-fill)] z-20 h-3 w-0.5 rounded bg-white will-change-[left]" />
                    </VolumeSlider.Root>
                  </div>
                </div>
                <div className="inline-flex items-center gap-[6px]">
                  {pip && (
                    <ToggleButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15 data-[pressed]:hidden">
                      <PictureInPicture className="size-4" />
                    </ToggleButton>
                  )}
                  <FullscreenButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15">
                    <CornersOut className="size-4 group-data-[active]:hidden" />
                    <CornersIn className="hidden size-4 group-data-[active]:block" />
                  </FullscreenButton>
                </div>
              </div>
            </Controls.Group>
          </Controls.Root>
          <div className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center">
            <Spinner.Root
              className="media-buffering:animate-spin text-white media-buffering:opacity-100 opacity-0 transition-opacity duration-200 ease-linear"
              size={50}
            >
              <Spinner.Track className="opacity-25" width={5} />
              <Spinner.TrackFill className="opacity-75" width={5} />
            </Spinner.Root>
          </div>
        </MediaProvider>
        <MediaAnnouncer />
      </MediaPlayer>
    );
  }
);

// export const VideoPlayer = ({ src, poster, top }: Props) => {
//   return (
//     <MediaPlayer
//       className="size-full overflow-hidden bg-black font-sans text-white"
//       src={{ src, type: "video/mp4" }}
//     >
//       <MediaProvider className="size-full object-cover">
//         <Poster asChild>
//           <img
//             className="absolute inset-0 block size-full bg-black object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
//             src={poster}
//             alt="poster"
//             draggable={false}
//           />
//         </Poster>
//         <Controls.Root className="pointer-events-none absolute inset-0 z-10 flex size-full flex-col opacity-0 transition-opacity data-[visible]:opacity-100">
//           <Controls.Group className="pointer-events-auto w-full bg-gradient-to-b from-black/40 p-4">
//             {top}
//           </Controls.Group>
//           <div className="flex-1" />
//           <Controls.Group className="pointer-events-auto flex w-full flex-col gap-[6px] bg-gradient-to-t from-black/40 p-4">
//             <div className="flex items-center gap-[6px]">
//               <div className="flex items-center font-semibold text-sm">
//                 <Time className="tabular-nums" type="current" />
//                 <div className="mx-1 text-white/80">/</div>
//                 <Time className="tabular-nums" type="duration" />
//               </div>
//               <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
//                 <TimeSlider.Track className="relative z-0 h-[3px] w-full rounded bg-white/30">
//                   <TimeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded bg-white will-change-[width]" />
//                   <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded bg-white/50 will-change-[width]" />
//                 </TimeSlider.Track>
//                 <TimeSlider.Thumb className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-[var(--slider-fill)] z-20 h-4 w-1 rounded bg-white opacity-0 transition-opacity duration-200 will-change-[left] group-data-[active]:opacity-100" />
//               </TimeSlider.Root>
//             </div>
//             <div className="flex w-full items-center justify-between">
//               <div className="flex w-full items-center gap-[6px]">
//                 <PlayButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15">
//                   <Play
//                     className="hidden size-4 group-data-[paused]:block"
//                     weight="fill"
//                   />
//                   <Pause
//                     className="size-4 group-data-[paused]:hidden"
//                     weight="fill"
//                   />
//                 </PlayButton>
//                 <SeekButton
//                   className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15"
//                   seconds={-10}
//                 >
//                   <ArrowCounterClockwise className="size-4" />
//                 </SeekButton>
//                 <SeekButton
//                   className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15"
//                   seconds={10}
//                 >
//                   <ArrowClockwise className="size-4" />
//                 </SeekButton>
//                 <div className="inline-flex h-9 items-center space-x-2 rounded-custom bg-white/10 py-2 pr-4 pl-3 outline-none backdrop-blur-2xl hover:bg-white/15">
//                   <MuteButton className="group relative cursor-pointer outline-none">
//                     <SpeakerNone className="hidden size-4 group-data-[state='muted']:block" />
//                     <SpeakerLow className="hidden size-4 group-data-[state='low']:block" />
//                     <SpeakerHigh className="hidden size-4 group-data-[state='high']:block" />
//                   </MuteButton>
//                   <VolumeSlider.Root className="group relative inline-flex w-20 cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
//                     <VolumeSlider.Track className="relative z-0 my-1 h-0.5 w-full rounded bg-white/30">
//                       <VolumeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded bg-white will-change-[width]" />
//                     </VolumeSlider.Track>
//                     <VolumeSlider.Thumb className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-[var(--slider-fill)] z-20 h-3 w-0.5 rounded bg-white will-change-[left]" />
//                   </VolumeSlider.Root>
//                 </div>
//               </div>
//               <div className="inline-flex items-center gap-[6px]">
//                 <ToggleButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15 data-[pressed]:hidden">
//                   <PictureInPicture className="size-4" />
//                 </ToggleButton>
//                 <FullscreenButton className="group relative inline-flex size-9 cursor-pointer items-center justify-center rounded-custom bg-white/10 outline-none backdrop-blur-2xl hover:bg-white/15">
//                   <CornersOut className="size-4 group-data-[active]:hidden" />
//                   <CornersIn className="hidden size-4 group-data-[active]:block" />
//                 </FullscreenButton>
//               </div>
//             </div>
//           </Controls.Group>
//         </Controls.Root>
//         <div className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center">
//           <Spinner.Root
//             className="media-buffering:animate-spin text-white media-buffering:opacity-100 opacity-0 transition-opacity duration-200 ease-linear"
//             size={50}
//           >
//             <Spinner.Track className="opacity-25" width={5} />
//             <Spinner.TrackFill className="opacity-75" width={5} />
//           </Spinner.Root>
//         </div>
//       </MediaProvider>
//       <MediaAnnouncer />
//     </MediaPlayer>
//   );
// };

export { VideoPlayer };
