import VideoCard from "@components/common/VideoCard";
import React from "react";

const Timeline = () => {
  return (
    <div className="grid my-5 md:my-6 gap-x-4 lg:grid-cols-4 gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
      {Array(30)
        .fill(0)
        .map((v, i) => (
          <VideoCard key={i} />
        ))}
    </div>
  );
};

export default Timeline;
