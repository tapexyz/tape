import { getRandomProfilePicture } from "@utils/functions/getRandomProfilePicture";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";

dayjs.extend(relativeTime);

const VideoCard = () => {
  return (
    <div className="transition duration-200 ease-in-out rounded-b-lg bg-secondary hover:shadow">
      <div className="rounded-t-lg aspect-w-16 aspect-h-9">
        <img
          src="https://i.ytimg.com/vi/VgjyPmFKxCU/hqdefault.jpg"
          alt=""
          draggable={false}
          className="object-cover object-center w-full h-full rounded-t-lg lg:w-full lg:h-full"
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
          <div className="flex flex-col items-start pb-1">
            <h1 className="mb-1 text-base line-clamp-2">
              Intro to Foundry | The Fastest smart contract framework Intro to
              Foundry | The Fastest smart contract framework
            </h1>
            <Link href={""}>
              <a className="text-sm hover:opacity-100 opacity-70">T Series</a>
            </Link>
            <div className="flex items-center text-xs opacity-70">
              <span className="mr-1 whitespace-nowrap">1k views ·</span>
              <span className="">
                {dayjs(new Date("2022-05-12T00:39:36.000Z")).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
