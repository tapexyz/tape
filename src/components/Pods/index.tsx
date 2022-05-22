import Layout from "@components/wrappers/Layout";

import PodCard from "./PodCard";
import PodPlayer from "./PodPlayer";

const Pods = () => {
  return (
    <Layout>
      <PodPlayer />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
        {Array(30)
          .fill(0)
          .map((v, i) => (
            <PodCard key={i} />
          ))}
      </div>
    </Layout>
  );
};

export default Pods;
