import Layout from "@components/wrappers/Layout";
import React from "react";

import Details from "./Details";

const LiveStudio = () => {
  //   const { data, error } = useFetch<any>(`/api/stream`, { method: "POST" });
  //   console.log(
  //     "🚀 ~ file: studio.tsx ~ line 7 ~ LiveStudio ~ data",
  //     data,
  //     error
  //   );

  return (
    <Layout>
      <div>
        <Details />
      </div>
    </Layout>
  );
};

export default LiveStudio;
