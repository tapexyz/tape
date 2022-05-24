import VideoCard from "@components/common/VideoCard";
import useAppStore from "@lib/store";
import { WATCH_LATER_LIBRARY } from "@utils/url-path";
import Link from "next/link";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import { MdOutlineWatchLater } from "react-icons/md";
import { LenstubePublication } from "src/types/local";

const Recents = () => {
  const { recentlyWatched } = useAppStore();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
          <MdOutlineWatchLater />
          <span>Watch Later</span>
        </h1>
        <Link href={WATCH_LATER_LIBRARY}>
          <a className="flex items-center space-x-1.5 text-xs text-indigo-500 hover:scale-105">
            <span>See all</span> <BiChevronRight />
          </a>
        </Link>
      </div>
      <div className="grid gap-x-4 lg:grid-cols-4 gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
        {recentlyWatched.map((video: LenstubePublication, idx: number) => (
          <VideoCard key={idx} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Recents;
