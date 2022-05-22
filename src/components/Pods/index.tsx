import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";

import PodsFeed from "./Feed";

const Pods = () => {
  return (
    <Layout>
      <MetaTags title="Pods" />
      <PodsFeed />
    </Layout>
  );
};

export default Pods;
