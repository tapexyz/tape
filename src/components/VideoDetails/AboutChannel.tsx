import { Button } from "@components/ui/Button";
import Tooltip from "@components/ui/Tooltip";
import getProfilePicture from "@utils/functions/getProfilePicture";
import React, { FC } from "react";
import { SiOpenmined } from "react-icons/si";
import { Profile } from "src/types";

type Props = {
  channel: Profile & any;
  isFollower: boolean;
};

const AboutChannel: FC<Props> = ({ channel, isFollower }) => {
  const subscribeType = channel?.followModule?.__typename;

  return (
    <div className="flex items-center justify-between w-full my-4">
      <div className="flex-none mr-3">
        <img
          src={getProfilePicture(channel)}
          className="w-12 h-12 border-2 rounded-full"
          draggable={false}
          alt=""
        />
      </div>
      <div className="flex flex-wrap justify-between flex-1 py-2 space-y-2">
        <div className="flex flex-col items-start mr-2">
          <h1 className="font-bold">{channel?.handle}</h1>
          <span className="inline-flex items-center space-x-1 text-xs">
            {channel?.stats.totalFollowers} subscribers
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isFollower ? (
            <Tooltip content="Mint as NFT" placement="top">
              <span>
                <Button className="!p-2">
                  <SiOpenmined />
                </Button>
              </span>
            </Tooltip>
          ) : null}
          {subscribeType === "FeeFollowModuleSettings" ? (
            <Button>Join Channel</Button>
          ) : (
            <Button>Subscribe</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutChannel;
