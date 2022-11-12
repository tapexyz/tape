import NewVideoOutline from '@components/Common/Icons/NewVideoOutline'
import { Button } from '@components/UIElements/Button'
import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import Tooltip from '@components/UIElements/Tooltip'
import { Menu } from '@headlessui/react'
import usePersistStore from '@lib/store/persist'
import { UPLOAD } from '@utils/url-path'
import React from 'react'
import { HiOutlineStatusOnline, HiOutlineUpload } from 'react-icons/hi'

const NewVideoTrigger = () => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)

  if (!selectedChannelId) return null

  return (
    <DropMenu
      trigger={
        <Button
          className="md:!block !hidden"
          icon={<NewVideoOutline className="w-4 h-4" />}
        >
          <span>New video</span>
        </Button>
      }
    >
      <div className="p-1 mt-1.5 overflow-hidden border border-gray-100 rounded-xl shadow-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-md">
          <Menu.Item
            as={NextLink}
            href={UPLOAD}
            className="inline-flex items-center px-2.5 py-1.5 space-x-2 rounded-lg opacity-90 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <HiOutlineUpload />
            <span className="whitespace-nowrap">Upload Video</span>
          </Menu.Item>
          <Menu.Item>
            <button
              type="button"
              disabled
              className="inline-flex opacity-40 items-center px-2.5 py-1.5 space-x-2 rounded-lg"
            >
              <Tooltip content="Coming soon">
                <span className="inline-flex items-center space-x-2">
                  <HiOutlineStatusOnline className="text-red-500" />
                  <span className="whitespace-nowrap">Go Live Now</span>
                </span>
              </Tooltip>
            </button>
          </Menu.Item>
        </div>
      </div>
    </DropMenu>
  )
}

export default NewVideoTrigger
