import { getRandomProfilePicture } from "@utils/functions/getRandomProfilePicture";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React, { FC } from "react";
import { LenstubePublication } from "src/types/local";

import VideoOptions from "./VideoOptions";

dayjs.extend(relativeTime);

type Props = {
  video: LenstubePublication;
};

const VideoCard: FC<Props> = ({ video }) => {
  return (
    <div className="transition duration-500 ease-in-out rounded-b group bg-secondary">
      <div className="rounded-t-lg aspect-w-16 aspect-h-9">
        <img
          src="https://i.ytimg.com/vi/VgjyPmFKxCU/hqdefault.jpg"
          alt=""
          draggable={false}
          className="object-cover object-center w-full h-full rounded-t lg:w-full lg:h-full"
        />
      </div>
      <div className="p-2">
        <div className="flex items-start space-x-2.5">
          <div className="flex-none">
            <img
              className="w-8 h-8 rounded-full"
              src={getRandomProfilePicture("sas")}
              alt=""
              draggable={false}
            />
          </div>
          <div className="flex flex-col items-start flex-1 pb-1">
            <span className="flex w-full items-start justify-between space-x-1.5">
              <Link passHref href="/videos/0x02-0x05">
                <a className="mb-1.5 text-sm font-medium line-clamp-2">
                  {video.metadata?.name}
                </a>
              </Link>
              <VideoOptions />
            </span>
            <Link href={`/${video.profile?.handle}`}>
              <a className="text-xs hover:opacity-100 opacity-70">T Series</a>
            </Link>
            <div className="flex items-center text-xs opacity-70 mt-0.5">
              <span className="mr-1 whitespace-nowrap">1k views ·</span>
              <span>{dayjs(new Date(video.createdAt)).fromNow()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
