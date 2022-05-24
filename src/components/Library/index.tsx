import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";
import dynamic from "next/dynamic";

const Commented = dynamic(() => import("./Commented"));
const Recents = dynamic(() => import("./Recents"));

const Library = () => {
  return (
    <Layout>
      <MetaTags title="Library" />
      <Recents />
      <Commented />
    </Layout>
  );
};

export default Library;
