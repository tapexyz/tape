import VideoCard from '@components/CommonT/VideoCard'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import { RECENTS_LIBRARY } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { MdHistory } from 'react-icons/md'
import { LenstubePublication } from 'src/types/local'

const Recents = () => {
  const { recentlyWatched } = useAppStore()

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
          <MdHistory />
          <span>Recents</span>
        </h1>
        <Link href={RECENTS_LIBRARY}>
          <a className="flex items-center space-x-0.5 text-xs text-green-900">
            <span>See all</span> <BiChevronRight />
          </a>
        </Link>
      </div>
      {!recentlyWatched.length && (
        <NoDataFound text="This list has no videos." />
      )}
      <div className="grid gap-x-4 lg:grid-cols-4 gap-y-1 md:gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
        {recentlyWatched.map((video: LenstubePublication, idx: number) => (
          <VideoCard key={idx} video={video} />
        ))}
      </div>
    </div>
  )
}

export default Recents
