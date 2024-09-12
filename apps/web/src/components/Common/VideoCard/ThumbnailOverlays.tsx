import { getPublication, getPublicationData } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens";
import type { FC } from "react";
import React from "react";

import { formatTimeFromSeconds } from "@/lib/formatTime";

type Props = {
  video: AnyPublication;
};

const ThumbnailOverlays: FC<Props> = ({ video }) => {
  const targetPublication = getPublication(video);
  const metadata = getPublicationData(targetPublication.metadata);
  const videoDuration = metadata?.asset?.duration;

  if (!videoDuration) {
    return null;
  }

  return (
    <div>
      <span className="absolute bottom-2 right-2 rounded bg-black px-1 py-0.5 text-xs font-bold text-white">
        {formatTimeFromSeconds(String(videoDuration))}
      </span>
    </div>
  );
};

export default ThumbnailOverlays;
