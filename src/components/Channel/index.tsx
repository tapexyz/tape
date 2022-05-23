import { useQuery } from "@apollo/client";
import MetaTags from "@components/common/MetaTags";
import Layout from "@components/wrappers/Layout";
import { PROFILE_QUERY } from "@utils/gql/queries";
import { useRouter } from "next/router";
import React from "react";
import { LoaderIcon } from "react-hot-toast";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { Profile } from "src/types";

import BasicInfo from "./BasicInfo";
import Upload from "./upload";

const Channel = () => {
  const { query } = useRouter();
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: query.channel } },
    skip: !query.channel,
  });
  console.log(
    "🚀 ~ file: index.tsx ~ line 19 ~ Channel ~ query.channel",
    query
  );

  if (error) return <Custom500 />;
  if (data?.profiles?.items?.length === 0) return <Custom404 />;

  const channel: Profile = data?.profiles?.items[0];
  console.log("🚀 ~ file: index.tsx ~ line 26 ~ Channel ~ channel", channel);

  if (loading) {
    return <LoaderIcon />;
  }

  return (
    <Layout>
      <MetaTags title={channel?.handle} />
      <Upload />
      <BasicInfo channel={channel} />
    </Layout>
  );
};

export default Channel;
