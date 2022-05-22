import Layout from "@components/wrappers/Layout";

import Categories from "./Categories";
import Feed from "./Feed";

const Explore = () => {
  return (
    <Layout>
      <Categories />
      <div className="md:my-5">
        <Feed />
      </div>
    </Layout>
  );
};

export default Explore;
