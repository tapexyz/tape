import { formatTimeToDuration } from "@/helpers/date-time";
import { formatBytes } from "@/helpers/format-number";
import { sanitizeStorageUrl } from "@/helpers/sanitize-storage-url";
import { uploadMedia } from "@/helpers/upload";
import { useCreatePostStore } from "@/store/post";
import { ALLOWED_IMAGE_MIME_TYPES } from "@tape.xyz/constants";
import { ImageSquare } from "@tape.xyz/winder";
import { useRef } from "react";

export const Preview = () => {
  const {
    mediaType,
    file,
    setFile,
    duration,
    setDuration,
    coverUri,
    setCoverUri
  } = useCreatePostStore();
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  if (!file) return null;

  const onClickMedia = () => {
    mediaRef.current?.paused
      ? mediaRef.current?.play()
      : mediaRef.current?.pause();
  };

  const onChooseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const { uri } = await uploadMedia(file);
      setCoverUri(uri);
    }
  };

  const mediaSource = {
    src: URL.createObjectURL(file),
    type: file.type
  };

  return (
    <div className="group relative w-full">
      {mediaType === "video" ? (
        <video
          controls={false}
          className="cursor-pointer rounded-card"
          onClick={() => onClickMedia()}
          onKeyDown={() => onClickMedia()}
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          onLoadedMetadata={() => setDuration(mediaRef.current?.duration ?? 0)}
        >
          <source {...mediaSource} />
          <track kind="captions" className="hidden" />
        </video>
      ) : (
        <div className="flex size-full flex-col gap-1 p-1">
          <span className="aspect-square overflow-hidden rounded-card">
            <label
              htmlFor="poster"
              className="grid aspect-square cursor-pointer place-items-center rounded-card bg-secondary"
            >
              {coverUri ? (
                <img
                  src={sanitizeStorageUrl(coverUri)}
                  alt="cover"
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageSquare className="size-7" />
                  <span className="text-sm">Upload Poster</span>
                </div>
              )}
              <input
                type="file"
                id="poster"
                className="hidden"
                onChange={onChooseFile}
                accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
              />
            </label>
          </span>
          <audio
            controls
            className="w-full"
            controlsList="nodownload noremoteplayback"
            onClick={() => onClickMedia()}
            onKeyDown={() => onClickMedia()}
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            onLoadedMetadata={() =>
              setDuration(mediaRef.current?.duration ?? 0)
            }
          >
            <source {...mediaSource} />
            <track kind="captions" className="hidden" />
          </audio>
        </div>
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
