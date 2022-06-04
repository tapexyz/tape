import Popover from '@components/UIElements/Popover'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import Link from 'next/link'
import React from 'react'
import { AiOutlineVideoCameraAdd } from 'react-icons/ai'
import { FiUpload } from 'react-icons/fi'
import { HiOutlineStatusOnline } from 'react-icons/hi'

const NewVideoTrigger = () => {
  const { selectedChannel } = useAppStore()

  return (
    <Popover
      trigger={
        <Tooltip className="!rounded-lg" content="New Video">
          <div className="flex self-center p-2 rounded-md focus:outline-none hover:bg-white dark:hover:bg-gray-800">
            <AiOutlineVideoCameraAdd />
          </div>
        </Tooltip>
      }
      panelClassName="right-0"
    >
      <div className="p-1 mt-1.5 overflow-hidden border border-gray-100 rounded-lg shadow-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          <Link href={`/${selectedChannel?.handle}?upload=1`}>
            <a className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiUpload />
              <span className="whitespace-nowrap">Upload</span>
            </a>
          </Link>
          <button
            disabled
            className="inline-flex opacity-40 items-center px-3 py-1.5 space-x-2 rounded-lg"
          >
            <Tooltip content="Coming soon">
              <span className="inline-flex items-center space-x-2">
                <HiOutlineStatusOnline className="text-red-500" />
                <span className="whitespace-nowrap">Go Live</span>
              </span>
            </Tooltip>
          </button>
        </div>
      </div>
    </Popover>
  )
}

export default NewVideoTrigger
