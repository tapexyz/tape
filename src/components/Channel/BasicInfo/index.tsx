import { Button } from "@components/ui/Button";
import Tooltip from "@components/ui/Tooltip";
import getProfilePicture from "@utils/functions/getProfilePicture";
import { SETTINGS } from "@utils/url-path";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { Profile } from "src/types";

type Props = {
  channel: Profile & any;
};

const BasicInfo: FC<Props> = ({ channel }) => {
  const router = useRouter();

  const onClickCustomize = () => {
    router.push(SETTINGS);
  };
  return (
    <div className="flex">
      <div className="relative w-full">
        <span>
          <div
            style={{
              backgroundImage: `url(${channel?.coverPicture?.original?.url})`,
            }}
            className="absolute w-full bg-center bg-no-repeat bg-cover rounded -z-10 h-44 md:h-72"
          />
        </span>
        <div className="flex items-center pl-4 mt-44 md:mt-72">
          <div className="flex-none mr-4 md:mr-6">
            <img
              src={getProfilePicture(channel)}
              alt=""
              className="border-2 rounded-full w-14 h-14 md:-mt-10 md:w-32 md:h-32"
              draggable={false}
            />
          </div>
          <div className="flex flex-wrap justify-between flex-1 py-2 space-y-2">
            <div className="flex flex-col items-start mr-3">
              <h1 className="font-bold md:text-xl">{channel?.handle}</h1>
              <span className="inline-flex items-center space-x-1 text-sm md:text-base">
                {channel.stats.totalFollowers} subscribers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip content="Customize Channel" placement="top">
                <Button onClick={() => onClickCustomize()} className="!p-2">
                  <AiOutlineEdit />
                </Button>
              </Tooltip>
              <Button>Join Channel</Button>
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
