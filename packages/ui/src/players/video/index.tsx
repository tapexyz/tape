import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { WORKER_TRAILS_URL } from "@tape.xyz/constants";
import type { PlayerProps } from "./Player";
import PlayerInstance from "./Player";
import SensitiveWarning from "./SensitiveWarning";

interface Props extends PlayerProps {
  url: string;
  pid: string;
  currentTime?: number;
  isSensitiveContent?: boolean;
  refCallback?: (ref: HTMLMediaElement) => void;
}

export const VideoPlayer = memo(function VideoPlayer({
  url,
  address,
  pid,
  options,
  posterUrl,
  refCallback,
  ratio = "16to9",
  currentTime = 0,
  isSensitiveContent,
  showControls = true,
  shouldUpload
}: Props) {
  const playerRef = useRef<HTMLMediaElement>();
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent);

  const addTrail = async () => {
    await fetch(WORKER_TRAILS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pid,
        action: "play_media"
      })
    });
  };

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    refCallback?.(ref);
    playerRef.current = ref;
    playerRef.current.currentTime = Number(currentTime || 0);
    addTrail();
  }, []);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    playerRef.current.currentTime = Number(currentTime || 0);
  }, [currentTime]);

  const onContextClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`w-full ${options.maxHeight && "h-full"}`}>
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <div
          onContextMenu={onContextClick}
          className={`relative flex ${options.maxHeight && "h-full"}`}
        >
          <PlayerInstance
            ratio={ratio}
            url={url}
            options={options}
            address={address}
            posterUrl={posterUrl}
            playerRef={mediaElementRef}
            showControls={showControls}
            shouldUpload={shouldUpload}
          />
        </div>
      )}
    </div>
  );
});
