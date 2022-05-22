import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";

import Categories from "./Categories";
import Feed from "./Feed";

const Explore = () => {
  return (
    <Layout>
      <MetaTags title="Explore" />
      <Categories />
      <div className="md:my-5">
        <Feed />
      </div>
    </Layout>
  );
};

export default Explore;
