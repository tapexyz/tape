import { useQuery } from "@apollo/client";
import useAppStore from "@lib/store";
import getProfilePicture from "@utils/functions/getProfilePicture";
import { RECOMMENDED_PROFILES_QUERY } from "@utils/gql/queries";
import useDraggableScroll from "@utils/hooks/useDraggableScroll";
import Link from "next/link";
import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Profile } from "src/types";

const Recommended = () => {
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const { onMouseDown } = useDraggableScroll(scrollRef);
  const { recommendedChannels, setRecommendedChannels } = useAppStore();
  const { error } = useQuery(RECOMMENDED_PROFILES_QUERY, {
    onCompleted(data) {
      const channels = data?.recommendedProfiles;
      setRecommendedChannels(channels);
    },
  });

  const scrollToOffset = (scrollOffset: number) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += scrollOffset;
  };

  if (recommendedChannels.length === 0 || error) {
    return null;
  }

  return (
    <div className="relative cursor-grab">
      <div
        className="flex items-center mx-12 overflow-auto no-scrollbar"
        ref={scrollRef}
        onMouseDown={onMouseDown}
      >
        <button
          onClick={() => scrollToOffset(-200)}
          className="absolute left-0 inline-flex items-center p-3 rounded-full focus:outline-none from-gray-100 dark:from-gray-900 bg-gradient-to-r to-transparent"
        >
          <FiChevronLeft />
        </button>
        <div className="flex items-center space-x-6">
          {recommendedChannels.map((channel: Profile) => (
            <div
              key={channel?.id}
              className="flex items-center flex-none space-x-2"
            >
              <img
                className="w-8 h-8 rounded-full"
                src={getProfilePicture(channel)}
                alt=""
                draggable={false}
              />
              <div className="flex flex-col items-start">
                <Link key={channel?.id} href={channel.handle} passHref>
                  <h6 className="text-sm cursor-pointer">{channel.handle}</h6>
                </Link>
                <span className="text-xs opacity-70 whitespace-nowrap">
                  {channel.stats.totalFollowers} subcribers
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scrollToOffset(200)}
          className="absolute right-0 inline-flex items-center p-3 rounded-full focus:outline-none to-gray-100 dark:to-gray-900 bg-gradient-to-r from-transparent"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Recommended;
