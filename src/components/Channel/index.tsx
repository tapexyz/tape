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

import Upload from "./upload";

const Channel = () => {
  const {
    query: { channel },
  } = useRouter();
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: channel } },
    skip: !channel,
  });

  if (error) return <Custom500 />;
  if (data?.profiles?.items?.length === 0) return <Custom404 />;

  const profile: Profile = data?.profiles?.items[0];

  return (
    <Layout>
      <MetaTags title={profile?.handle} />

      {loading && <LoaderIcon />}
      <Upload />
      <div>{profile?.handle}</div>
    </Layout>
  );
};

export default Channel;
