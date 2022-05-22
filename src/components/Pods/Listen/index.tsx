import Layout from "@components/wrappers/Layout";
import useAppStore from "@lib/store";
import { useEffect } from "react";

import PodCard from "../PodCard";
import PodPlayer from "../PodPlayer";

const Listen = () => {
  const { setSelectedPodUrl } = useAppStore();

  useEffect(() => {
    setSelectedPodUrl("ds");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <PodPlayer />
      <div className="py-4">
        <h1 className="text-xs font-semibold uppercase opacity-60">
          More episodes
        </h1>
        <div className="grid grid-cols-2 gap-4 my-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
          {Array(30)
            .fill(0)
            .map((v, i) => (
              <PodCard key={i} />
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Listen;
