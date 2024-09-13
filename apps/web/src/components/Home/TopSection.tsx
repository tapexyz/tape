import { useRef } from "react";

import HorizontalScroller from "@/components/Common/HorizontalScroller";
import useProfileStore from "@/lib/store/idb/profile";

import GitcoinAlert from "./GitcoinAlert";
import LatestBytes from "./LatestBytes";
import LensManagerAlert from "./LensManagerAlert";
import WelcomeAlert from "./WelcomeAlert";
import ZorbAlert from "./ZorbAlert";

const TopSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { activeProfile } = useProfileStore();

  return (
    <div className="flex flex-col">
      <HorizontalScroller sectionRef={sectionRef} heading="New & Trending" />
      <div
        ref={sectionRef}
        className="no-scrollbar relative flex items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth laptop:pt-6 pt-4"
      >
        {!activeProfile?.id && <WelcomeAlert />}
        <GitcoinAlert />
        <LensManagerAlert />
        <ZorbAlert />
        <LatestBytes />
      </div>
    </div>
  );
};

export default TopSection;
