import Timeline from "@components/Home/Timeline";
import Layout from "@components/wrappers/Layout";

import Categories from "./Categories";

const Explore = () => {
  return (
    <Layout>
      <Categories />
      <Timeline />
    </Layout>
  );
};

export default Explore;
