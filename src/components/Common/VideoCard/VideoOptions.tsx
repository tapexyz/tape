import Popover from '@components/UIElements/Popover'
import React from 'react'
import { FiFlag } from 'react-icons/fi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineWatchLater } from 'react-icons/md'
import { RiShareForwardLine } from 'react-icons/ri'

const VideoOptions = () => {
  return (
    <Popover
      trigger={
        <div className="invisible p-1 group-hover:visible">
          <HiOutlineDotsVertical />
        </div>
      }
      panelClassName="right-0"
    >
      <div className="p-1 mt-0.5 overflow-hidden border border-gray-200 rounded-lg shadow dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          <button className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
            <MdOutlineWatchLater className="text-base" />
            <span className="whitespace-nowrap">Watch Later</span>
          </button>
          <button className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
            <RiShareForwardLine className="text-base" />
            <span className="whitespace-nowrap">Share</span>
          </button>
          <button className="inline-flex hover:text-red-500 items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiFlag className="text-sm mx-0.5" />
            <span className="whitespace-nowrap">Report</span>
          </button>
        </div>
      </div>
    </Popover>
  )
}

export default VideoOptions
