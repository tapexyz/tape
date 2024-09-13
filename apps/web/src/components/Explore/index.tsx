import { EVENTS } from "@tape.xyz/generic";
import { useEffect } from "react";

import CategoryFilters from "@/components/Common/CategoryFilters";
import MetaTags from "@/components/Common/MetaTags";
import useSw from "@/hooks/useSw";

import ExploreFeed from "./Feed";

const Explore = () => {
  const { addEventToQueue } = useSw();

  useEffect(() => {
    addEventToQueue(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.EXPLORE });
  }, []);

  return (
    <div className="container mx-auto max-w-screen-ultrawide">
      <MetaTags title="Explore" />
      <CategoryFilters heading="Everything" />
      <ExploreFeed />
    </div>
  );
};

export default Explore;
