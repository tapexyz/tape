import { Button } from '@components/UIElements/Button'
import Popover from '@components/UIElements/Popover'
import Tooltip from '@components/UIElements/Tooltip'
import {
  StatusOnlineIcon,
  UploadIcon,
  VideoCameraIcon
} from '@heroicons/react/outline'
import { UPLOAD } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'

const NewVideoTrigger = () => {
  return (
    <Popover
      trigger={
        <>
          <span className="md:hidden">
            <VideoCameraIcon className="w-6 h-6" />
          </span>
          <Button
            icon={<VideoCameraIcon className="w-5 h-5" />}
            className="!hidden md:!flex"
          >
            New video
          </Button>
        </>
      }
      panelClassName="right-0 w-36"
    >
      <div className="p-1 mt-1.5 overflow-hidden border border-gray-100 rounded-lg shadow-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-md">
          <Link href={UPLOAD}>
            <a className="inline-flex items-center px-4 py-1.5 space-x-2 rounded-md opacity-90 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800">
              <UploadIcon className="w-4 h-4" />
              <span className="whitespace-nowrap">Upload</span>
            </a>
          </Link>
          <button
            disabled
            className="inline-flex opacity-40 items-center px-4 py-1.5 space-x-2 rounded-md"
          >
            <Tooltip content="Coming soon">
              <span className="inline-flex items-center space-x-2">
                <StatusOnlineIcon className="w-4 h-4 text-red-500" />
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
