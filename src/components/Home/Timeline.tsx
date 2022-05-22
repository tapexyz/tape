import VideoCard from "@components/common/VideoCard";
import React, { FC } from "react";
import { LenstubePublication } from "src/types/local";

type Props = {
  videos: LenstubePublication[];
};

const Timeline: FC<Props> = ({ videos }) => {
  return (
    <div className="grid gap-x-4 lg:grid-cols-4 gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
      {videos?.map((video: LenstubePublication, idx: number) => (
        <VideoCard key={`${video?.id}_${idx}`} video={video} />
      ))}
    </div>
  );
};

export default Timeline;
