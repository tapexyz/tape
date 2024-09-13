import { EVENTS } from "@tape.xyz/generic";
import type { NextPage } from "next";
import { useEffect } from "react";

import useSw from "@/hooks/useSw";

import Feed from "./Feed";
import TopSection from "./TopSection";

const Home: NextPage = () => {
  const { addEventToQueue } = useSw();

  useEffect(() => {
    addEventToQueue(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.HOME });
  }, []);

  return (
    <div className="container mx-auto max-w-screen-ultrawide">
      <TopSection />
      <Feed />
    </div>
  );
};

export default Home;
