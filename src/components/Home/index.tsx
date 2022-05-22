import Layout from "@components/wrappers/Layout";
import type { NextPage } from "next";

import Recommended from "./Recommended";
import Timeline from "./Timeline";

const Home: NextPage = () => {
  return (
    <Layout>
      <Recommended />
      <Timeline />
    </Layout>
  );
};

export default Home;
