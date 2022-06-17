import { Button } from '@components/UIElements/Button'
import Popover from '@components/UIElements/Popover'
import Tooltip from '@components/UIElements/Tooltip'
import { UPLOAD } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'
import { AiOutlineVideoCameraAdd } from 'react-icons/ai'
import { HiOutlineStatusOnline, HiOutlineUpload } from 'react-icons/hi'

const NewVideoTrigger = () => {
  return (
    <Popover
      trigger={
        <>
          <Button
            size="sm"
            className="md:!hidden"
            icon={<AiOutlineVideoCameraAdd className="text-sm" />}
          >
            <span>New video</span>
          </Button>
          <Button
            className="md:!block !hidden"
            icon={<AiOutlineVideoCameraAdd className="text-lg" />}
          >
            <span>New video</span>
          </Button>
        </>
      }
    >
      <div className="p-1 mt-1.5 overflow-hidden border border-gray-100 rounded-lg shadow-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-md">
          <Link href={UPLOAD}>
            <a className="inline-flex items-center px-4 py-1.5 space-x-2 rounded-md opacity-90 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800">
              <HiOutlineUpload />
              <span className="whitespace-nowrap">Upload Video</span>
            </a>
          </Link>
          <button
            disabled
            className="inline-flex opacity-40 items-center px-4 py-1.5 space-x-2 rounded-md"
          >
            <Tooltip content="Coming soon">
              <span className="inline-flex items-center space-x-2">
                <HiOutlineStatusOnline className="text-red-500" />
                <span className="whitespace-nowrap">Go Live Now</span>
              </span>
            </Tooltip>
          </button>
        </div>
      </div>
    </Popover>
  )
}

export default NewVideoTrigger
