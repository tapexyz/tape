import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";
import dynamic from "next/dynamic";
import React from "react";

const Video = dynamic(() => import("./Video"));

const VideoDetails = () => {
  return (
    <Layout>
      <MetaTags title="Video Details" />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex flex-col col-span-3 overflow-hidden rounded">
          <Video />
        </div>
        <div className="">wip</div>
      </div>
    </Layout>
  );
};

export default VideoDetails;
