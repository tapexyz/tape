import { useQuery } from "@apollo/client";
import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";
import { LENSTUBE_VIDEOS_APP_ID } from "@utils/constants";
import { VIDEO_DETAIL_QUERY } from "@utils/gql/queries";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import Custom500 from "src/pages/500";
import { Profile } from "src/types";
import { LenstubePublication } from "src/types/local";

import AboutChannel from "./AboutChannel";
import SuggestedVideos from "./SuggestedVideos";
import VideoComments from "./VideoComments";

const Video = dynamic(() => import("./Video"));

const VideoDetails = () => {
  const {
    query: { id },
  } = useRouter();
  const { data, error } = useQuery(VIDEO_DETAIL_QUERY, {
    variables: {
      request: { publicationId: id },
      sources: [LENSTUBE_VIDEOS_APP_ID],
    },
    skip: !id,
  });

  if (error) return <Custom500 />;

  return (
    <Layout>
      <MetaTags title="Video Details" />
      <div className="grid grid-cols-1 gap-y-4 md:gap-4 md:grid-cols-4">
        <div className="col-span-3">
          <Video video={data.publication as LenstubePublication} />
          <AboutChannel channel={data.publication.profile as Profile} />
          <VideoComments />
        </div>
        <div className="col-span-1">
          <SuggestedVideos />
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetails;
