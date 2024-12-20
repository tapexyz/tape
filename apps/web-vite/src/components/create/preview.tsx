import { formatTimeToDuration } from "@/helpers/date-time";
import { formatBytes } from "@/helpers/format-number";
import { useCreatePostStore } from "@/store/post";
import { useRef } from "react";

export const Preview = () => {
  const { mediaType, file, setFile, duration, setDuration } =
    useCreatePostStore();
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  if (!file) return null;

  const onClickMedia = () => {
    mediaRef.current?.paused
      ? mediaRef.current?.play()
      : mediaRef.current?.pause();
  };

  const mediaSource = {
    src: URL.createObjectURL(file),
    type: file.type
  };

  return (
    <div className="group relative flex flex-col items-center">
      {mediaType === "video" ? (
        <video
          controls={false}
          className="rounded-card"
          onClick={() => onClickMedia()}
          onKeyDown={() => onClickMedia()}
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          onLoadedMetadata={() => setDuration(mediaRef.current?.duration ?? 0)}
        >
          <source {...mediaSource} />
          <track kind="captions" />
        </video>
      ) : (
        <audio
          onClick={() => onClickMedia()}
          onKeyDown={() => onClickMedia()}
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          onLoadedMetadata={() => setDuration(mediaRef.current?.duration ?? 0)}
        >
          <source {...mediaSource} />
          <track kind="captions" />
        </audio>
      )}
      <div className="-bottom-6 absolute flex w-full items-center justify-between px-3 text-muted text-xs transition-colors group-hover:text-primary">
        <span>
          {formatTimeToDuration(duration)} / {formatBytes(file.size)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFile(null);
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
