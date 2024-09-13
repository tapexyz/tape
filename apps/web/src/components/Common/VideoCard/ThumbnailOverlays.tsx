import { getPublication, getPublicationData } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens";
import type { FC } from "react";

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
      <span className="absolute right-2 bottom-2 rounded bg-black px-1 py-0.5 font-bold text-white text-xs">
        {formatTimeFromSeconds(String(videoDuration))}
      </span>
    </div>
  );
};

export default ThumbnailOverlays;
