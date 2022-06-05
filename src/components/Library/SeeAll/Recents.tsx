import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { MdHistory } from 'react-icons/md'
import { LenstubePublication } from 'src/types/local'
const Timeline = dynamic(() => import('../../Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const SeeAllRecents = () => {
  const { recentlyWatched } = useAppStore()
  const [videos, setVideos] = useState<LenstubePublication[]>([])

  useEffect(() => {
    setVideos(recentlyWatched)
  }, [recentlyWatched])

  return (
    <Layout>
      <MetaTags title="Recently watched Videos" />
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
            <MdHistory />
            <span>Recently watched</span>
          </h1>
        </div>
        {videos?.length === 0 && <NoDataFound text="No watched videos yet." />}
        <Timeline videos={videos} />
      </div>
    </Layout>
  )
}

export default SeeAllRecents
