import Timeline from "@components/Home/Timeline";
import Layout from "@components/wrappers/Layout";

import Categories from "./Categories";

const Explore = () => {
  return (
    <Layout>
      <Categories />
      <div className="md:my-5">
        <Timeline />
      </div>
    </Layout>
  );
};

export default Explore;
