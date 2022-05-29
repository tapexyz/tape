import { LENSTER_WEBSITE_URL } from "@utils/constants";
import React, { FC } from "react";
import { HiOutlineGlobe } from "react-icons/hi";
import { RiTwitterLine } from "react-icons/ri";
import { Profile } from "src/types";

type Props = {
  channel: Profile;
};

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes;

  const getSpecificAttribute = (key: string) => {
    return attributes?.find((el) => el.key === key)?.value;
  };

  return (
    <div className="p-4 space-y-4 md:space-y-6">
      {channel?.bio && (
        <div className="flex flex-col">
          <h6 className="text-[11px] font-semibold uppercase opacity-70">
            Description
          </h6>
          <p>{channel?.bio}</p>
        </div>
      )}
      <div className="flex flex-col">
        <h6 className="text-[11px] mb-2 font-semibold uppercase opacity-70">
          Links
        </h6>
        <div className="space-y-1.5">
          {getSpecificAttribute("website") && (
            <div className="flex items-center space-x-1 text-sm">
              <HiOutlineGlobe />
              <a
                href={getSpecificAttribute("website")}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Website
              </a>
            </div>
          )}
          {getSpecificAttribute("twitter") && (
            <div className="flex items-center space-x-1 text-sm">
              <RiTwitterLine />
              <a
                href={getSpecificAttribute("website")}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Twitter
              </a>
            </div>
          )}
          <div className="flex items-center space-x-1 text-sm">
            <span className="text-[10px] grayscale" role="img">
              🌸
            </span>
            <a
              href={`${LENSTER_WEBSITE_URL}/u/${channel?.handle}`}
              target="_blank"
              rel="noreferer noreferrer"
              className="hover:text-indigo-500"
            >
              Lenster
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
