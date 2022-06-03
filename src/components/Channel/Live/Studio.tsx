import Layout from '@components/CommonT/Layout'
import React from 'react'

import VideoDetails from './VideoDetails'

const LiveStudio = () => {
  //   const { data, error } = useFetch<any>(`/api/stream`, { method: "POST" });
  //   console.log(
  //     "🚀 ~ file: studio.tsx ~ line 7 ~ LiveStudio ~ data",
  //     data,
  //     error
  //   );

  return (
    <Layout>
      <div className="">
        <VideoDetails />
      </div>
    </Layout>
  )
}

export default LiveStudio
