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
        <div className="flex self-center px-2 py-[5px] space-x-2 border border-green-900 rounded-md">
          <AiOutlineVideoCameraAdd />
          <span className="text-xs">New video</span>
        </div>
      }
      panelClassName="right-0"
    >
      <div className="p-1 mt-1.5 overflow-hidden border border-gray-100 rounded-lg shadow-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          <Link href={`/${selectedChannel?.handle}?upload=1`}>
            <a className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-md opacity-90 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiUpload />
              <span className="whitespace-nowrap">Upload</span>
            </a>
          </Link>
          <button
            disabled
            className="inline-flex opacity-40 items-center px-3 py-1.5 space-x-2 rounded-md"
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
