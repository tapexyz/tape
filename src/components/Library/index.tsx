import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";
import dynamic from "next/dynamic";

const Commented = dynamic(() => import("./Sections/Commented"));
const Recents = dynamic(() => import("./Sections/Recents"));
const WatchLater = dynamic(() => import("./Sections/WatchLater"));

const Library = () => {
  return (
    <Layout>
      <MetaTags title="Library" />
      <WatchLater />
      <Recents />
      <Commented />
    </Layout>
  );
};

export default Library;
