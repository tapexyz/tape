import SortOutline from '@components/Common/Icons/SortOutline'
import DropMenu from '@components/UIElements/DropMenu'
import Tooltip from '@components/UIElements/Tooltip'
import { Menu } from '@headlessui/react'
import useChannelStore from '@lib/store/channel'
import clsx from 'clsx'
import React from 'react'
import { CustomCommentsFilterEnum } from 'utils'

const CommentsFilter = () => {
  const selectedCommentFilter = useChannelStore(
    (state) => state.selectedCommentFilter
  )
  const setSelectedCommentFilter = useChannelStore(
    (state) => state.setSelectedCommentFilter
  )

  return (
    <DropMenu
      trigger={
        <Tooltip content="Sort by" placement="top">
          <span>
            <SortOutline className="h-5 w-5" />
          </span>
        </Tooltip>
      }
    >
      <div className="bg-secondary mt-1 overflow-hidden rounded-xl border border-gray-200 p-1 text-sm shadow dark:border-gray-800">
        <Menu.Item
          className={clsx(
            'w-full rounded-lg px-3 py-1.5 text-left',
            selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS
              ? 'bg-gray-100 dark:bg-gray-800'
              : 'opacity-60 hover:opacity-100'
          )}
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.RELEVANT_COMMENTS)
          }
          as="button"
        >
          <span className="whitespace-nowrap">Relevant</span>
        </Menu.Item>
        <Menu.Item
          className={clsx(
            'w-full rounded-lg px-3 py-1.5 text-left',
            selectedCommentFilter === CustomCommentsFilterEnum.NEWEST_COMMENTS
              ? 'bg-gray-100 dark:bg-gray-800'
              : 'opacity-60 hover:opacity-100'
          )}
          onClick={() =>
            setSelectedCommentFilter(CustomCommentsFilterEnum.NEWEST_COMMENTS)
          }
          as="button"
        >
          <span className="whitespace-nowrap">Newest first</span>
        </Menu.Item>
      </div>
    </DropMenu>
  )
}

export default CommentsFilter
