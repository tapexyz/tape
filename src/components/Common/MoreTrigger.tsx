import { Button } from '@components/UIElements/Button'
import Popover from '@components/UIElements/Popover'
import Tooltip from '@components/UIElements/Tooltip'
import {
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_TWITTER_HANDLE
} from '@utils/constants'
import { DISCORD, PRIVACY } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi'

const MoreTrigger = () => {
  return (
    <Popover
      trigger={
        <Tooltip content="More" placement="right">
          <Button variant="outlined" className="md:!p-2.5 !p-1.5">
            <HiOutlineDotsVertical />
          </Button>
        </Tooltip>
      }
      position="left"
    >
      <div className="p-1 max-h-96 mt-1.5 w-40 overflow-x-hidden overflow-y-auto border shadow-xl border-gray-100 rounded-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out">
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            More
          </div>
          <div className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
            <Link href={DISCORD}>
              <a target="_blank">Discord</a>
            </Link>
          </div>
          <div className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
            <Link href={`https://github.com/${LENSTUBE_GITHUB_HANDLE}`}>
              <a target="_blank">Github</a>
            </Link>
          </div>
          <div className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
            <Link href={`https://twitter.com/${LENSTUBE_TWITTER_HANDLE}`}>
              <a target="_blank">Twitter</a>
            </Link>
          </div>
          <div className="text-[11px] cursor-default p-1 font-semibold uppercase opacity-50">
            Legal
          </div>
          <div className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
            <Link href={PRIVACY}>
              <a target="_blank">Privacy</a>
            </Link>
          </div>
        </div>
      </div>
    </Popover>
  )
}

export default MoreTrigger
