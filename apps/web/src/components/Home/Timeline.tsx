import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens";
import type { FC } from "react";

import VideoCard from "@/components/Common/VideoCard";

type Props = {
  videos: AnyPublication[];
};

const Timeline: FC<Props> = ({ videos }) => {
  return (
    <div className="grid-col-1 grid desktop:grid-cols-4 tablet:grid-cols-3 ultrawide:grid-cols-6 gap-x-4 gap-y-2 md:gap-y-6">
      {videos?.map((video: AnyPublication, i) => {
        const targetPublication = getPublication(video);
        return (
          <VideoCard key={`${video?.id}_${i}`} video={targetPublication} />
        );
      })}
    </div>
  );
};

export default Timeline;
