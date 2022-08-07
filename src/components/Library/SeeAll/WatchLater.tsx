import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import usePersistStore from '@lib/store/persist'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { MdOutlineWatchLater } from 'react-icons/md'
import { LenstubePublication } from 'src/types/local'
const Timeline = dynamic(() => import('../../Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const SeeAllWatchLater = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const watchLater = usePersistStore((state) => state.watchLater)

  useEffect(() => {
    setVideos(watchLater)
  }, [watchLater])

  return (
    <>
      <MetaTags title="Watch Later Videos" />
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
            <MdOutlineWatchLater />
            <span>Watch Later</span>
          </h1>
        </div>
        {videos?.length === 0 && (
          <NoDataFound text="No videos added" isCenter withImage />
        )}
        <Timeline videos={videos} />
      </div>
    </>
  )
}

export default SeeAllWatchLater
