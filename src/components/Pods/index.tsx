import Layout from "@components/wrappers/Layout";

import PodCard from "./PodCard";

const Pods = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 my-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
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
