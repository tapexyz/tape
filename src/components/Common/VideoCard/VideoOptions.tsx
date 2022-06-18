import Popover from '@components/UIElements/Popover'
import useAppStore from '@lib/store'
import { isAlreadyAddedToWatchLater } from '@utils/functions/isAlreadyAddedToWatchLater'
import Link from 'next/link'
import React from 'react'
import { FiFlag } from 'react-icons/fi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineWatchLater } from 'react-icons/md'
import { RiShareForwardLine } from 'react-icons/ri'
import { LenstubePublication } from 'src/types/local'

const VideoOptions = ({
  video,
  setShowShare
}: {
  video: LenstubePublication
  setShowShare: React.Dispatch<boolean>
}) => {
  const { addToWatchLater, removeFromWatchLater, watchLater } = useAppStore()

  return (
    <Popover
      trigger={
        <div className="p-1 lg:invisible group-hover:visible">
          <HiOutlineDotsVertical />
        </div>
      }
      panelClassName="right-0"
    >
      <div className="p-1 mt-0.5 overflow-hidden border border-gray-200 rounded-lg shadow dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          <button
            onClick={() =>
              isAlreadyAddedToWatchLater(video, watchLater)
                ? removeFromWatchLater(video)
                : addToWatchLater(video)
            }
            className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdOutlineWatchLater className="text-base" />
            <span className="whitespace-nowrap">
              {isAlreadyAddedToWatchLater(video, watchLater)
                ? 'Remove from Watch Later'
                : 'Watch Later'}
            </span>
          </button>
          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RiShareForwardLine className="text-base" />
            <span className="whitespace-nowrap">Share</span>
          </button>
          <Link href={`/report/${video.id}`}>
            <a className="inline-flex hover:text-red-500 items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiFlag className="text-sm ml-0.5" />
              <span className="whitespace-nowrap">Report</span>
            </a>
          </Link>
        </div>
      </div>
    </Popover>
  )
}

export default VideoOptions
